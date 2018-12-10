// CLI to print permisisons and packages from specified APK

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const inquirer = require('inquirer');
const helper = require('./helper');

inquirer
  .prompt([
    {
      type: 'input',
      name: 'apk',
      message: 'APK file to analyze'
    }
  ])
  .then(answers => {
    answers.apk = answers.apk.replace('.apk','');
    analyzeApk(answers);
  });


function analyzeApk(answers) {
  // APKTool to unzip the APK and get dependencies
  exec(`apktool d -f ${answers.apk}.apk`, (err, stdout, stderr) => {
    console.log("Unzipping APK with APKTool...\n");
    if (err) {
      console.log("nodejs error running apktool:", err.message, err.stack);
      return;
    }

    if (stderr) {
      console.log("apktool error:", stderr);
    }

    console.log("Getting permissions...\n");
    let manifest = fs.readFileSync(path.join(__dirname, answers.apk, 'AndroidManifest.xml'), { encoding: 'UTF-8' });
    let permissions = helper.getPermissions(manifest);

    let packageList = [];
    let root = path.join(__dirname, answers.apk, 'smali');

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
