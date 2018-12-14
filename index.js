#!/usr/bin/env node

// CLI to print permisisons and packages from specified APK
'use strict';

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const inquirer = require('inquirer');
const wrapper = require('./lib/wrapper');
const printer = require('./lib/printer');
const utility = require('./lib/utility');

var argv = require('yargs')
  .usage('Usage: $0 [options]')
  .option('l', {
    alias: 'local-source',
    nargs: 1,
    describe: '<path_to_apk> relative path to local apk source',
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
    default: false,
  })
  .option('d', {
    alias: 'dependencies-only',
    describe: 'only output dependencies',
    type: 'boolean',
    default: false,
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

let getLocalApk = {
  type: 'input',
  name: 'pathToApk',
  message: 'Relative path to local APK:',
}

let getRemoteApk = {
  type: 'input',
  name: 'urlToApk',
  message: 'URL for remote APK:',
}



main();

async function main() {
  var pathToApk = '';
  var urlToApk = '';
  var pathToUnzippedApk = '';
  var specificPermission = '';
  var specificDependency = '';
  var root = __dirname;
  
  // If statements for path arguments
  if (!argv.l && !argv.r) {
    let answers = await inquirer.prompt([localOrRemote]);

    if (answers.source == 'local') {
      let local = await inquirer.prompt([getLocalApk]);
      pathToApk = local.pathToApk;
    }

    else if (answers.source == 'remote') {
      remote = await inquirer.prompt([getRemoteApk]);
      pathToApk = remote.urlToApk;
    }
  }

  if (argv.l && argv.r) {
    console.log("APKI Error: Please select either --remote-source (-r) or --local-source (-l) but not both.")
    console.log("See more information with 'apki --help'");
    return;
  }

  else if (argv.l) {
    // check validity of path
    // Clean path to the APK;
    pathToApk = await utility.verifyPathToApk(root, argv.l);
  }

  else if (argv.r) {
    // check validity of url
    console.log(root);
    urlToApk = await utility.verifyUrlToApk(argv.r);
    pathToApk = await utility.downloadApk(root, urlToApk);
  }


  // if statements for specifying permission or dependency

  if (argv.x) {
    // just look for specific permission
    specificPermission = argv.x;
  }

  if (argv.y) {
    // just look for specific dependency
    specificDependency = argv.y;
  }


  pathToUnzippedApk = await utility.unzipApk(pathToApk);

  console.log(pathToUnzippedApk);

  // Just permissions
  if (argv.p) {
    console.log(wrapper.getPermissions(pathToUnzippedApk)); 
  }

  // Just Dependencies
  else if (argv.d) {
    console.log(wrapper.getDependencies(root, pathToUnzippedApk));
  }

  else {
    // default
    console.log(wrapper.getPermissions(pathToUnzippedApk));
    console.log(wrapper.getDependencies(root, pathToUnzippedApk));
  }
}
