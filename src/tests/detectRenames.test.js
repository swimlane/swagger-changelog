'use strict';

const test = require('tape');
const detectRenames = require('../app/changelog').detectRenames;

const diff = [
  { ruleId: 'delete-path',
    message: '/pet/findByStatus - Deleted',
    path: '/pet/findByStatus',
    type: 'errors' },
  { ruleId: 'delete-path',
    message: '/pet/findByTags - Deleted',
    path: '/pet/findByTags',
    type: 'errors' },
  { ruleId: 'add-required-param',
    message: '/pet/{petId} (get) - Required param petIdz added',
    path: '/pet/{petId}',
    method: 'get',
    param: 'petIdz',
    type: 'errors' },
  { ruleId: 'add-method',
    message: '/pet (put) - Method added',
    path: '/pet',
    method: 'put',
    type: 'infos' },
  { ruleId: 'delete-param',
    message: '/pet/{petId} (get) - Param petId deleted',
    path: '/pet/{petId}',
    method: 'get',
    param: 'petId',
    type: 'infos' },
  { ruleId: 'add-path',
    message: '/pet/findByStatii - Added',
    path: '/pet/findByStatii',
    type: 'infos' },
  { ruleId: 'add-path',
    message: '/pet/findByTag - Added',
    path: '/pet/findByTag',
    type: 'infos' }
];

const renamed = [
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

test('Detect Renames', (assert) => {
  assert.deepEqual(detectRenames(diff), renamed, 'It should detect renamed endpoints and arguments');

  assert.end();
});
