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
    type: 'infos' },
  { ruleId: 'delete-path',
    message: '/pet/findByMuffin - Deleted',
    path: '/pet/findByMuffin',
    type: 'errors' },
  { ruleId: 'add-path',
    message: '/pet/findByMuffler - Added',
    path: '/pet/findByMuffler',
    type: 'errors' }
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
    ruleId: 'delete-path',
    message: '/pet/findByMuffin - Deleted',
    path: '/pet/findByMuffin',
    type: 'errors'
  },
  {
    ruleId: 'add-path',
    message: '/pet/findByMuffler - Added',
    path: '/pet/findByMuffler',
    type: 'errors'
  },
  {
    ruleId: 'rename-path',
    message: 'Path \'/pet/findByStatus\' renamed to \'/pet/findByStatii\'',
    path: '/pet/findByStatus',
    newPath: '/pet/findByStatii',
    type: 'renamed'
  },
  {
    ruleId: 'rename-path',
    message: 'Path \'/pet/findByTags\' renamed to \'/pet/findByTag\'',
    path: '/pet/findByTags',
    newPath: '/pet/findByTag',
    type: 'renamed'
  },
  {
    ruleId: 'rename-param',
    message: '/pet/{petId} (get) - Param \'petId\' renamed to \'petIdz\'',
    path: '/pet/{petId}',
    method: 'get',
    param: 'petId',
    newParam: 'petIdz',
    type: 'renamed'
  }
];

const renamedLowThreshold = [
  {
    ruleId: 'add-method',
    message: '/pet (put) - Method added',
    path: '/pet',
    method: 'put',
    type: 'infos'
  },
  {
    ruleId: 'rename-path',
    message: 'Path \'/pet/findByStatus\' renamed to \'/pet/findByStatii\'',
    path: '/pet/findByStatus',
    newPath: '/pet/findByStatii',
    type: 'renamed'
  },
  {
    ruleId: 'rename-path',
    message: 'Path \'/pet/findByTags\' renamed to \'/pet/findByTag\'',
    path: '/pet/findByTags',
    newPath: '/pet/findByTag',
    type: 'renamed'
  },
  {
    ruleId: 'rename-path',
    message: 'Path \'/pet/findByMuffin\' renamed to \'/pet/findByMuffler\'',
    path: '/pet/findByMuffin',
    newPath: '/pet/findByMuffler',
    type: 'renamed'
  },
  {
    ruleId: 'rename-param',
    message: '/pet/{petId} (get) - Param \'petId\' renamed to \'petIdz\'',
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

test('Detect Renames - Allow match threshold changes', (assert) => {
  const drConfig = {
    thresholds: {
      endpoint: 0.5,
      args: 0.5
    }
  };

  assert.deepEqual(detectRenames(diff, drConfig), renamedLowThreshold, 'It should detect renamed endpoints at a lower threshold - config');

  const oldEndPointEnv = process.env.SC_THRES_ENDPOINT;
  const oldParamEnv = process.env.SC_THRES_PARAM;

  process.env.SC_THRES_ENDPOINT = 0.5;
  process.env.SC_THRES_PARAM = 0.5;

  assert.deepEqual(detectRenames(diff), renamedLowThreshold, 'It should detect renamed endpoints at a lower threshold - environment');

  process.env.SC_THRES_ENDPOINT = oldEndPointEnv;
  process.env.SC_THRES_PARAM = oldParamEnv;

  assert.end();
});
