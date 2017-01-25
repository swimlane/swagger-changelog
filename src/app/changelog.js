'use strict';

const SwaggerDiff = require('swagger-diff');

const TYPE_MAP = {
  errors: {
    name: 'Breaking'
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
 * @return {Promise}        resolves with an object with the following levels, error, warnings, info, unmatched
 * {
 *  errors: [
 *    {
 *      ruleId: 'delete-path',
 *      message: '/pet/findByStatus - Deleted',
 *      path: '/pet/findByStatus'
 *    }
 *  ],
 * }
 */
function diff (oldSpec, newSpec) {
  return SwaggerDiff(oldSpec, newSpec);
}

/**
 * Builds a changelog from a diff
 * @param  {Object} diff a diff object from diff()
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

  for (let type of ['errors', 'warnings', 'infos', 'unmatched']) {
    if (diff[type] && diff[type].length) {
      const items = diff[type].reduce((res, item) => {
        res.push(`${TYPE_MAP[type].name}: ${item.message}`)

        return res;
      }, []);

      retVal.items = retVal.items.concat(items);
    }
  }

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
  return diff(oldSpec, newSpec).then(buildChangelog)
  .catch((err) => { throw err });
}

module.exports = {
  diff,
  buildChangelog,
  changelog
};
