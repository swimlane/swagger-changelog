#!/usr/bin/env node

const program = require('commander');
const package = require('../package');
const changelog = require('../src/app/changelog').changelog;

program
  .version(package.version)
  .usage('<path/to/spec1> <path/to/spec2>')
  .description(package.description)
  .parse(process.argv);

changelog(program.args[0], program.args[1])
  .then((log) => {
    /* eslint no-console: 0 */
    console.log(log.paragraph);
  })
  .catch((err) => {
    throw err;
  });
