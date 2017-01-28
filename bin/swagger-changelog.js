#!/usr/bin/env node

const program = require('commander');
const package = require('../package');
const changelog = require('../src/app/changelog').changelog;

program
  .version(package.version)
  .arguments('<path/to/spec1> <path/to/spec2>')
  .option('-e, --endpoint <n>', 'Endpoint Threshold, 0-1.0 (Default 0.85, higher means closer)', parseFloat)
  .option('-p, --param <n>', 'Param Threshold, 0-1.0 (Default 0.75, higher means closer)', parseFloat)
  .description(package.description)
  .parse(process.argv);

const config = {
  thresholds: {}
};

if (program.endpoint) {
  config.thresholds.endpoint = program.endpoint;
}

if (program.param) {
  config.thresholds.param = program.param;
}

changelog(program.args[0], program.args[1], config)
  .then((log) => {
    /* eslint no-console: 0 */
    console.log(log.paragraph);
  })
  .catch((err) => {
    throw err;
  });
