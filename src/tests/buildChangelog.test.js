'use strict';

const test = require('tape');
const buildChangelog = require('../app/changelog').buildChangelog;

const diff = { errors:
   [ { ruleId: 'delete-path',
       message: '/pet/findByStatus - Deleted',
       path: '/pet/findByStatus' },
     { ruleId: 'delete-path',
       message: '/pet/findByTags - Deleted',
       path: '/pet/findByTags' },
     { ruleId: 'add-required-param',
       message: '/pet/{petId} (get) - Required param petIdz added',
       path: '/pet/{petId}',
       method: 'get',
       param: 'petIdz' } ],
  warnings: [],
  infos:
   [ { ruleId: 'add-method',
       message: '/pet (put) - Method added',
       path: '/pet',
       method: 'put' },
     { ruleId: 'delete-param',
       message: '/pet/{petId} (get) - Param petId deleted',
       path: '/pet/{petId}',
       method: 'get',
       param: 'petId' },
     { ruleId: 'add-path',
       message: '/pet/findByStatii - Added',
       path: '/pet/findByStatii' },
     { ruleId: 'add-path',
       message: '/pet/findByTag - Added',
       path: '/pet/findByTag' } ],
  unmatchDiffs: [] };

test('Build Change Log', (assert) => {
  const changelog = buildChangelog(diff);

  assert.ok(changelog, 'buildChangelog should return a valid object');
  assert.ok(changelog.paragraph.length > 0, 'buildChangelog should have a paragraph member');
  assert.equal(changelog.items.length, 7, 'buildChangelog should have seven items');

  assert.end();
});
