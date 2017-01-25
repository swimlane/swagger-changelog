'use strict';

const test = require('tape');
const diff = require('../app/changelog').diff;

const specs = {
  '1.0.0': require('./specs/petstore.1'),
  '1.1.0': require('./specs/petstore.1.1')
};

test('Diff', (assert) => {
  assert.plan(5);

  diff(specs['1.0.0'], specs['1.1.0'])
    .then((res) => {
      assert.ok(res, 'Diff should return a valid object');
      assert.ok(res.errors, 'Diff should return error level changes between petstore 1 and petstore 1.1');
      assert.equal(res.errors.length, 3, 'Diff should find three error level changes');

      assert.ok(res.infos, 'Diff should return info level changes between petstore 1 and petstore 1.1');
      assert.equal(res.infos.length, 4, 'Diff should find four error level changes');
    });
});
