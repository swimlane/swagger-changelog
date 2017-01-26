'use strict';

const test = require('tape');
const buildChangelog = require('../app/changelog').buildChangelog;

const diff = [
  {
    ruleId: 'add-method',
    message: '/pet (put) - Method added',
    path: '/pet',
    method: 'put',
    type: 'infos'
  },
  {
    ruleId: 'rename-method',
    message: '/pet/findByStatus renamed to /pet/findByStatii',
    path: '/pet/findByStatus',
    newPath: '/pet/findByStatii',
    type: 'renamed'
  },
  {
    ruleId: 'rename-method',
    message: '/pet/findByTags renamed to /pet/findByTag',
    path: '/pet/findByTags',
    newPath: '/pet/findByTag',
    type: 'renamed'
  },
  {
    ruleId: 'rename-param',
    message: '/pet/{petId} (get) - Param petId renamed to petIdz',
    path: '/pet/{petId}',
    method: 'get',
    param: 'petId',
    newParam: 'petIdz',
    type: 'renamed'
  }
];

test('Build Change Log', (assert) => {
  const changelog = buildChangelog(diff);

  assert.ok(changelog, 'buildChangelog should return a valid object');
  assert.ok(changelog.paragraph.length > 0, 'buildChangelog should have a paragraph member');
  assert.equal(changelog.items.length, 4, 'buildChangelog should have 4 items');

  assert.end();
});
