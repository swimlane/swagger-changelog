'use strict';

const test = require('tape');
const changelog = require('../app/changelog').changelog;

const specs = {
  '1.0.0': require('./specs/petstore.1'),
  '1.1.0': require('./specs/petstore.1.1')
};

test('Changelog', (assert) => {
  assert.plan(3);

  changelog(specs['1.0.0'], specs['1.1.0'])
    .then((log) => {
      assert.ok(log, 'changelog should return object');
      assert.ok(log.paragraph.length > 0, 'changelog should have a paragraph member');
      assert.equal(log.items.length, 6, 'changelog should have six items');
    });
});

test('Changelog - Detect config', (assert) => {
  assert.plan(3);

  const detectConfig = {
    thresholds: {
      endpoint: 0.5,
      args: 0.5
    }
  }

  changelog(specs['1.0.0'], specs['1.1.0'], detectConfig)
    .then((log) => {
      assert.ok(log, 'changelog should return object');
      assert.ok(log.paragraph.length > 0, 'changelog should have a paragraph member');
      assert.equal(log.items.length, 5, 'changelog should have five items');
    });
});
