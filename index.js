#!/usr/bin/env node

// CLI to print permisisons and packages from specified APK
'use strict';

const inquirer = require('inquirer');
const chalk = require('chalk');

const fs = require('fs');

const wrapper = require('./lib/wrapper');
const output = require('./lib/output');
const utility = require('./lib/utility');

var argv = require('yargs')
  .usage('Usage: $0 [options]')
  .option('l', {
    alias: 'local-source',
    nargs: 1,
    describe: '<path_to_apk> path to local apk',
  })
  .option('r', {
    alias: 'remote-source',
    nargs: 1,
    describe: '<url> remote apk URL',
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
  .example('$0')
  .example('$0 -r https://pathtoapk.io -x camera')
  .example('$0 -l ./Downloads/myapk.apk -d')
  .argv;

output.printTitle();

let localOrRemote = {
  type: 'list',
  name: 'source',
  message: 'Analyze local or remote source APK?',
  choices: ['remote', 'local'],
}

let getLocalApk = {
  type: 'input',
  name: 'pathToApk',
  message: 'Path to local APK:',
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
  var permissionsArray = null;
  var dependenciesArray = null;
  var root = __dirname;

  /**
   * If statments for command line arguments
   */
  if (!argv.l && !argv.r) {
    let answers = await inquirer.prompt([localOrRemote]);

    if (answers.source == 'local') {
      let local = await inquirer.prompt([getLocalApk]);
      pathToApk = await utility.verifyPathToApk(local.pathToApk.trim());
      console.log('\n');
    }

    else if (answers.source == 'remote') {
      let remote = await inquirer.prompt([getRemoteApk]);
      urlToApk = await utility.verifyUrlToApk(remote.urlToApk.trim());
      pathToApk = await utility.downloadApk(root, urlToApk);
    }
  }

  if (argv.l && argv.r) {

    console.log(
      chalk.red("APKI Error: Please select either --remote-source (-r) or --local-source (-l) but not both.")
    );
    console.log(
      chalk.red("See more information with 'apki --help'")
    );
    return;
  }


  else if (argv.l) {
    pathToApk = await utility.verifyPathToApk(argv.l);
  }

  else if (argv.r) {
    urlToApk = await utility.verifyUrlToApk(argv.r);
    pathToApk = await utility.downloadApk(root, urlToApk);
  }

  /**
   * Unzip APK
   */
  pathToUnzippedApk = await utility.unzipApk(pathToApk);

  /**
 * Check for specific permission
 */
  if (argv.x) {
    specificPermission = argv.x;
  }

  /**
   * Check for specific dependency
   */
  if (argv.y) {
    specificDependency = argv.y;
  }

  /**
   * Check flags for only permissions
   */
  if (argv.p) {
    permissionsArray = wrapper.getPermissions(pathToUnzippedApk);
  }

  /**
   * Check flag for only dependencies
   */
  else if (argv.d) {
    dependenciesArray = wrapper.getDependencies(root, pathToUnzippedApk);
  }

  /**
   * Default case, run both permissions and dependencies
   */
  else {
    permissionsArray = wrapper.getPermissions(pathToUnzippedApk);
    dependenciesArray = wrapper.getDependencies(root, pathToUnzippedApk);
  }

  
  output.writeToJSON(permissionsArray, dependenciesArray, 'output.json');
  output.writeToText(permissionsArray, dependenciesArray, 'output.txt');
}
