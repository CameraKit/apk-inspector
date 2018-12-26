#!/usr/bin/env node

// CLI to print permisisons and packages from specified APK
'use strict';

const inquirer = require('inquirer');
const chalk = require('chalk');

const wrapper = require('./lib/wrapper');
const printer = require('./lib/printer');
const utility = require('./lib/utility');

var argv = require('yargs')
  .usage('Usage: $0 [options]')
  .option('l', {
    alias: 'local-source',
    nargs: 1,
    describe: '<path_to_apk> relative path to local apk',
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

  /**
   * If statments for command line arguments
   */
  if (!argv.l && !argv.r) {
    let answers = await inquirer.prompt([localOrRemote]);

    if (answers.source == 'local') {
      let local = await inquirer.prompt([getLocalApk]);
      pathToApk = local.pathToApk;
      console.log('\n');
    }

    else if (answers.source == 'remote') {
      let remote = await inquirer.prompt([getRemoteApk]);
      urlToApk = await utility.verifyUrlToApk(remote.urlToApk);
      pathToApk = await utility.downloadApk(root, urlToApk);
      console.log('\n');
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
    pathToApk = await utility.verifyPathToApk(root, argv.l);
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
   * Check CameraKit flag
   */
  if (argv.c) {
    console.log('Checking for CameraKit package and Camera permisisons.\n');
    specificPermission = 'CAMERA';
    specificDependency = 'camerakit';
  }

  /**
   * Check flags for only permissions
   */
  if (argv.p) {
    printer.printPermissions(wrapper.getPermissions(pathToUnzippedApk), specificPermission);
  }

  /**
   * Check flag for only dependencies
   */
  else if (argv.d) {
    printer.printDependencies(wrapper.getDependencies(root, pathToUnzippedApk), specificDependency);
  }

  /**
   * Default case, run both permissions and dependencies
   */
  else {
    printer.printPermissions(wrapper.getPermissions(pathToUnzippedApk), specificPermission);
    printer.printDependencies(wrapper.getDependencies(root, pathToUnzippedApk), specificDependency);
  }
}
