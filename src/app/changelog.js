'use strict';

const SwaggerDiff = require('swagger-diff');
const Levenshtein = require('damerau-levenshtein');

const TYPE_MAP = {
  errors: {
    name: 'Breaking'
  },
  renamed: {
    name: 'Renamed'
  },
  warnings: {
    name: 'Major'
  },
  infos: {
    name: 'Changes',
  },
  unmatched: {
    name: 'Unmatched'
  }
};

/**
 * Provide a diff between two spec files
 * @param  {Object} oldSpec a valid swagger spec
 * @param  {Object} newSpec a valid swagger spec
 * @return {Promise}        resolves with an array of items
 * [
 *    {
 *      ruleId: 'delete-path',
 *      message: '/pet/findByStatus - Deleted',
 *      path: '/pet/findByStatus',
 *      type: 'error'
 *    }
 * ]
 */
function diff (oldSpec, newSpec) {
  return SwaggerDiff(oldSpec, newSpec)
    .then((diff) => new Promise((resolve) => {
      const retVal = [];
      for (let type in diff) {
        for (let item of diff[type]) {
          item.type = type;
          retVal.push(item);
        }
      }

      resolve(retVal);
    }));
}

/**
 * Detect a rename by comparing deleted paths/arguments with new paths/arguments
 * @example deleted: /foo/bar, added: /foo/bat should result in a renamed: /foo/bar -> /foo/bar
 *
 * @param  {Object} diff a diff object from diff()
 * @return {Object}      Any renamed items are removed from object and added to new location
 */
function detectRenames (diff) {
  let retVal = diff;
  const changes = {
    endpoints: {
      deleted: [],
      added: []
    },
    args: {
      deleted: [],
      added: []
    }
  };

  // split out endpoints and params
  for (let change of diff) {
    switch (change.ruleId) {
      case 'delete-path':
        changes.endpoints.deleted.push(change.path);
        break;
      case 'add-path':
        changes.endpoints.added.push(change.path);
        break;
      case 'add-required-param':
      case 'add-param':
      case 'add-optional-param':
        changes.args.added.push({
          param: change.param,
          path: change.path,
          method: change.method
        });
        break;
      case 'delete-param':
        changes.args.deleted.push({
          param: change.param,
          path: change.path,
          method: change.method
        });
        break;
    }
  }

  // compare and look for similar items
  for (let endpoint of changes.endpoints.deleted) {
    const closest = changes.endpoints.added.reduce((best, addedEndpoint) => {
      const ldiff = new Levenshtein(endpoint, addedEndpoint);
      if (ldiff.similarity > best.similarity) {
        best.endpoint = addedEndpoint;
        best.similarity = ldiff.similarity;
      }

      return best;
    }, { endpoint: '', similarity: 0 });

    if (closest.similarity >= 0.85) {
      // we have  a match
      // strip out the add/deleted
      retVal = retVal.filter((item) => {
        return !(
          (item.path === endpoint || item.path === closest.endpoint) &&
          (item.ruleId === 'delete-path' || item.ruleId === 'add-path')
        );
      });

      // add the rename
      retVal.push({
        ruleId: 'rename-path',
        message: `Path '${endpoint}' renamed to '${closest.endpoint}'`,
        path: endpoint,
        newPath: closest.endpoint,
        type: 'renamed'
      });
    }
  }

  for (let param of changes.args.deleted) {
    const closest = changes.args.added.reduce((best, addedParam) => {
      const ldiff = new Levenshtein(param.param, addedParam.param);
      if (ldiff.similarity > best.similarity) {
        best.param = addedParam;
        best.similarity = ldiff.similarity;
      }

      return best;
    }, { param: {}, similarity: 0 });

    if (closest.similarity >= 0.75) {
      // we have  a match
      // strip out the add/deleted
      retVal = retVal.filter((item) => {
        return !(
          (item.path === param.path || item.path === closest.param.path) &&
          (
            item.ruleId === 'add-required-param' ||
            item.ruleId === 'add-param' ||
            item.ruleId === 'add-optional-param' ||
            item.ruleId === 'delete-param'
          ) &&
          (item.param === param.param || item.param === closest.param.param)
        );
      });

      // add the rename
      retVal.push({
        ruleId: 'rename-param',
        message: `${param.path} (${param.method}) - Param '${param.param}' renamed to '${closest.param.param}'`,
        path: param.path,
        method: param.method,
        param: param.param,
        newParam: closest.param.param,
        type: 'renamed'
      });
    }
  }

  return retVal;
}

/**
 * Builds a changelog from a diff
 * @param  {Object} diff a diff array from diff()
 * @return {Object}      the resulting diff
 * {
 *  paragraph: string, the textual representation of the changelog
 *  items: string[], each item in an array for furthur modification
 * }
 */
function buildChangelog (diff) {
  const retVal = {
    paragraph: '',
    items: []
  };

  const items = diff.reduce((res, item) => {
    res.push(`${TYPE_MAP[item.type].name}: ${item.message}`);

    return res;
  }, []);

  retVal.items = retVal.items.concat(items);

  retVal.paragraph = retVal.items.join('\n');
  return retVal;
}

/**
 * Generate a changelog between two swagger specs
 * @param  {Object} oldSpec a valid swagger spec
 * @param  {Object} newSpec a valid swagger spec
 * @return {Promise}        resolves with an object @see buildChangelog
 */
function changelog (oldSpec, newSpec) {
  return diff(oldSpec, newSpec).then((res) => {
    return buildChangelog(detectRenames(res));
  })
  .catch((err) => { throw err });
}

module.exports = {
  diff,
  detectRenames,
  buildChangelog,
  changelog
};
