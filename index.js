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

printTitle();

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
  var path = '';
  
  // if statements for path arguments
  if (!argv.l && !argv.r) {
    let answers = await inquirer.prompt([localOrRemote]);

    if (answers.source == 'local') {
      let local = await inquirer.prompt([getLocalAPK]);
      path = local.pathToApk;
      // analyzeApk(localAnswers.pathToApk);
    }

    else if (answers.source == 'remote') {
      // let url = remoteAnswer;
      // convert url to path
      // run analyze
      remote = await inquirer.prompt([getRemoteAPK]);
      path = remoteAnswer.urlToApk;
    }
  }

  else if (argv.l) {
    // do just local
  }

  else {
    // default do remote
  }


  // if statements for specifying permission or dependency

  if (argv.x) {
    // just look for specific permission
  }

  else if (argv.y) {
    // just look for specific dependency
  }

  else {
    // do nothing special
  }


  // if statements for permissions or dependencies only
  if (argv.p) {
    // just permisisons
  }

  else if (argv.d) {
    // just dependencies
  }

  else {
    // default
  }


  console.log('Path', path);
}

/*  
*   Unzip APK
*   Arguments: path to zipped APK
*   Returns: path to unzipped APK
*/
function unzipApk(pathToApk) {
  console.log("Unzipping APK with APKTool...\n");
  // Put a progress bar here
  exec(`apktool d -f ${apk}.apk`, (err, stdout, stderr) => {
    if (err) {
      console.log("nodejs error running apktool:", err.message, err.stack);
      return;
    }

    if (stderr) {
      console.log("apktool error:", stderr);
    }
  });
}


/*  
*   Get Permissions from unzipped APK
*   Arguments: path to unzipped APK
*   Returns: array of permissions
*/
function getPermissions(pathToUnzippedApk) {
  console.log("Getting permissions...\n");
  let manifest = fs.readFileSync(path.join(__dirname, pathToUnzippedApk, 'AndroidManifest.xml'), { encoding: 'UTF-8' });
  return inspector.getPermissions(manifest);
}


/*  
*   Get Dependencies from unzipped APK
*   Arguments: path to unzipped APK
*   Returns: array of package names
*/
function getDependencies(pathToUnzippedApk) {
  console.log("Getting dependencies...\n");
  let packageList = [];
  let root = path.join(__dirname, pathToUnzippedApk, 'smali');

  inspector.getDependencies(root, packageList);
  return packageList;
}

function printPermissions(permissionsArray) {
  console.log("Permissions requested by this application: ");
  permissionsArray.forEach(permission => {
    console.log(permission);
  });
  console.log('\n\n');
}

function printDependencies(dependenciesList) {
  console.log("Package dependencies requested by this application: ");
  dependenciesList.forEach( dependency => {
    console.log(dependency);
  });
  console.log('\n');
}

function printTitle() {
  console.log(
    chalk.magentaBright(
      figlet.textSync('APK Inspector', {
        font: 'Standard',
        horizontalLayout: 'default',
        verticalLayout: 'default',
      }
    )
  ));
}
