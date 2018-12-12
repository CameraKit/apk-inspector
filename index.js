#!/usr/bin/env node

// CLI to print permisisons and packages from specified APK
'use strict';

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const figlet = require('figlet');
const chalk = require('chalk');
const clear = require('clear');

const inquirer = require('inquirer');
const inspector = require('./lib/inspector');
const wrapper = require('./lib/wrapper');
const printer = require('./lib/printer');

var argv = require('yargs')
  .usage('Usage: $0 [options]')
  .option('l', {
    alias: 'local-source',
    nargs: 1,
    describe: '<path_to_apk> local apk source',
  })
  .option('r', {
    alias: 'remote-source',
    nargs: 1,
    describe: '<url> remote apk souce',
  })
  .option('p', {
    alias: 'permissions-only',
    describe: 'only output permissions',
    type: 'boolean',
  })
  .option('d', {
    alias: 'dependencies-only',
    describe: 'only output dependencies',
    type: 'boolean',
  })
  .option('x', {
    alias: 'specify-permission',
    nargs: 1,
    describe: '<string> name of permission to search',
  })
  .option('y', {
    alias: 'specify-dependency',
    nargs: 1,
    describe: '<string> name of dependency to search',
  })
  .alias('v', 'version')
  .describe('v', 'show version information')
  .help('h')
  .alias('h', 'help')
  .example('$0 -r https://pathtoapk.io -x camera')
  .example('$0 -l ./Downloads/myapk.apk -d')
  .argv;

printer.printTitle();

let localOrRemote = {
  type: 'list',
  name: 'source',
  message: 'Analyze local or remote source APK?',
  choices: ['remote', 'local'],
}

let getLocalAPK = {
  type: 'input',
  name: 'pathToApk',
  message: 'Path to local APK',
}

let getRemoteAPK = {
  type: 'input',
  name: 'urlToApk',
  message: 'URL for remote APK',
}

main();

async function main() {
  var pathToApk = '';
  var specificPermission = '';
  var specificDependency = '';
  var onlyPermissions = false;
  var onlyDependencies = false;
  
  // if statements for path arguments
  if (!argv.l && !argv.r) {
    let answers = await inquirer.prompt([localOrRemote]);

    if (answers.source == 'local') {
      let local = await inquirer.prompt([getLocalAPK]);
      pathToApk = local.pathToApk;
      // analyzeApk(localAnswers.pathToApk);
    }

    else if (answers.source == 'remote') {
      // let url = remoteAnswer;
      // convert url to path
      // run analyze
      remote = await inquirer.prompt([getRemoteAPK]);
      pathToApk = remote.urlToApk;
    }
  }

  else if (argv.l) {
    // check validity of path
    pathToApk = argv.l;
  }

  else {
    // check validity of url
    // transform url into apk path
    pathToApk = argv.r;
  }


  // if statements for specifying permission or dependency

  if (argv.x) {
    // just look for specific permission
    specificPermission = argv.x;
  }
  if
   (argv.y) {
    // just look for specific dependency
    specificDependency = argv.y;
  }

  // if statements for permissions or dependencies only
  if (argv.p) {
    // just permisisons
    onlyPermissions = true;
  }

  else if (argv.d) {
    // just dependencies
    onlyDependencies = true;
  }

  else {
    // default
  }


  console.log('Path', pathToApk);
  console.log('Specific Permission', specificPermission);
  console.log('Speicific Dependency', specificDependency);
  console.log('OnlyPermissions', onlyPermissions);
  console.log('Only Dependenceis', onlyDependencies);
}
