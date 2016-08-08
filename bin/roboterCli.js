#!/usr/bin/env node

'use strict';

const fs = require('fs'),
      path = require('path');

const buntstift = require('buntstift'),
      minimist = require('minimist'),
      shell = require('shelljs');

if (process.argv[2] === '--help') {
  buntstift.info('roboter  - automate your builds');
  buntstift.newLine();
  buntstift.info('Usage:');
  buntstift.info('  bot [command]');
  buntstift.newLine();
  buntstift.info('Available Commands:');
  buntstift.info('  analyse            run static code analysis');
  buntstift.info('  build-client       build a client application');
  buntstift.info('  build-server       build a server application');
  buntstift.info('  coverage           calculate test coverage');
  buntstift.info('  license            verify licenses');
  buntstift.info('  outdated           detect outdated packages');
  buntstift.info('  publish            publish a new version');
  buntstift.info('  test               run unit and integration tests');
  buntstift.info('  test-integration   run integration tests');
  buntstift.info('  test-units         run unit tests');
  buntstift.info('  update             update outdated packages');
  buntstift.info('  watch-client       continuously build a client application');
  buntstift.info('  watch-server       continuously build a server application');
  buntstift.exit(0);
}

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
