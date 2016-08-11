#!/usr/bin/env node

'use strict';

const fs = require('fs'),
      path = require('path');

const buntstift = require('buntstift'),
      minimist = require('minimist'),
      program = require('commander'),
      shell = require('shelljs');

const packageJson = require('../package.json');

const run = function () {
  /* eslint-disable no-sync */
  if (!fs.existsSync(path.join(process.cwd(), 'node_modules', 'roboter'))) {
    buntstift.error('roboter is not installed locally.');
    buntstift.newLine();
    buntstift.info('Please run the following command:');
    buntstift.newLine();
    buntstift.info('  npm install roboter --save-dev --save-exact');
    buntstift.exit(1);
  }

  if (
    !fs.existsSync(path.join(process.cwd(), 'node_modules', 'roboter-server')) &&
    !fs.existsSync(path.join(process.cwd(), 'node_modules', 'roboter-client'))
  ) {
    buntstift.error('Neither roboter-server nor roboter-client is installed locally.');
    buntstift.newLine();
    buntstift.info('Please run one of the following commands, depending on your environment:');
    buntstift.newLine();
    buntstift.info('  npm install roboter-server --save-dev --save-exact');
    buntstift.info('  npm install roboter-client --save-dev --save-exact');
    buntstift.exit(1);
  }

  const gulp = path.join(process.cwd(), 'node_modules', '.bin', 'gulp');

  if (!fs.existsSync(gulp)) {
    buntstift.error('gulp is not installed locally.');
    buntstift.newLine();
    buntstift.info('Please run the following command:');
    buntstift.newLine();
    buntstift.info('  npm install gulp --save-dev --save-exact');
    buntstift.exit(1);
  }

  const configurationFile = minimist(process.argv.slice(2), {
    string: 'file',
    default: 'roboter.js'
  }).file || 'roboter.js';

  const configurationFileWithPath = path.join(process.cwd(), configurationFile);

  if (!fs.existsSync(configurationFileWithPath)) {
    buntstift.error(`${configurationFile} is missing.`);
    buntstift.exit(1);
  }

  const args = process.argv.slice(2).join(' ');

  buntstift.exit(shell.exec(
    `${gulp} --gulpfile ${configurationFileWithPath} --color true ${args}`).code);
  /* eslint-enable no-sync */
};

if (process.argv.length === 2) {
  run();
}

program.
  version(packageJson.version).
  command('analyse', 'run static code analysis').
  action(run).
  command('build-client', 'build a client application').
  action(run).
  command('build-server', 'build a server application').
  action(run).
  command('coverage', 'calculate test coverage').
  action(run).
  command('license', 'verify licenses').
  action(run).
  command('outdated', 'detect outdated packages').
  action(run).
  command('publish', 'publish a new version').
  action(run).
  command('test', 'run unit and integration tests').
  action(run).
  command('test-integration', 'run integration tests').
  action(run).
  command('test-units', 'run unit tests').
  action(run).
  command('update', 'update outdated packages').
  action(run).
  command('watch-client', 'continuously build a client application').
  action(run).
  command('watch-server', 'continuously build a server application').
  action(run).
  parse(process.argv);
