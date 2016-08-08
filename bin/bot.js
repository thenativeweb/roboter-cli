#!/usr/bin/env node

'use strict';

const fs = require('fs'),
      path = require('path');

const buntstift = require('buntstift'),
      minimist = require('minimist'),
      program = require('commander'),
      shell = require('shelljs');

const packageJson = require('../package.json');

program.
  version(packageJson.version).
  command('analyse', 'run static code analysis').
  command('build-client', 'build a client application').
  command('build-server', 'build a server application').
  command('coverage', 'calculate test coverage').
  command('license', 'verify licenses').
  command('outdated', 'detect outdated packages').
  command('publish', 'publish a new version').
  command('test', 'run unit and integration tests').
  command('test-integration', 'run integration tests').
  command('test-units', 'run unit tests').
  command('update', 'update outdated packages').
  command('watch-client', 'continuously build a client application').
  command('watch-server', 'continuously build a server application').
  parse(process.argv);

/* eslint-disable no-sync */
if (!fs.existsSync(path.join(process.cwd(), 'node_modules', 'roboter'))) {
  buntstift.error('roboter is not installed locally.');
  buntstift.newLine();
  buntstift.info('Please run the following command:');
  buntstift.newLine();
  buntstift.info('  npm install roboter --save-dev --save-exact');
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
