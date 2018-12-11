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
const helper = require('./lib/helper');

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

console.log(
  chalk.magentaBright(
    figlet.textSync('APK Inspector', {
      font: 'Standard',
      horizontalLayout: 'default',
      verticalLayout: 'default',
    }
  )
));

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

if (!argv.l && !argv.r) {
  inquirer.prompt([localOrRemote]).then(answers => {
    if (answers.source == 'local') {
      inquirer.prompt([getLocalAPK]).then (localAnswers => {
        let path = localAnswers.pathToApk;
        analyzeApk(path);
      });
    }

    else if (answers.source == 'remote') {
      inquirer.prompt([getRemoteAPK]).then( remoteAnswer => {
        let url = remoteAnswer;
        // convert url to path
        // run analyze
      });
    }
  });
}

function analyzeApk(apk) {
  // APKTool to unzip the APK and get dependencies
  console.log("Unzipping APK with APKTool...\n");
  exec(`apktool d -f ${apk}.apk`, (err, stdout, stderr) => {
    if (err) {
      console.log("nodejs error running apktool:", err.message, err.stack);
      return;
    }

    if (stderr) {
      console.log("apktool error:", stderr);
    }

    console.log("Getting permissions...\n");
    let manifest = fs.readFileSync(path.join(__dirname, apk, 'AndroidManifest.xml'), { encoding: 'UTF-8' });
    let permissions = helper.getPermissions(manifest);

    let packageList = [];
    let root = path.join(__dirname, apk, 'smali');

    console.log("Getting dependencies...\n");
    helper.getDependencies(root, packageList);

    printPermissions(permissions);
    printDependencies(packageList);
  });
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
