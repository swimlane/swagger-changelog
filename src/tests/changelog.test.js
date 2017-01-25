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
      assert.ok(log.paragraph.length > 0, 'buildChangelog should have a paragraph member');
      assert.equal(log.items.length, 7, 'buildChangelog should have seven items');
    });
});
