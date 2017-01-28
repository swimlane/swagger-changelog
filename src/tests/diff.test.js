'use strict';

const test = require('tape');
const diff = require('../app/changelog').diff;

const specs = {
  '1.0.0': require('./specs/petstore.1'),
  '1.1.0': require('./specs/petstore.1.1')
};

test('Diff', (assert) => {
  assert.plan(3);

  diff(specs['1.0.0'], specs['1.1.0'])
    .then((res) => {
      assert.ok(Array.isArray(res), 'Diff should return a valid array');
      const typeCount = res.reduce((counts, change) => {
        counts[change.type]++;
        return counts;
      }, { errors: 0, warnings: 0, infos: 0, unmatched: 0});

      assert.equal(typeCount.errors, 4, 'Diff should find four errors');
      assert.equal(typeCount.infos, 5, 'Diff should find five infos');
    });
});
