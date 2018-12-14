const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const isUrl = require('is-url');
const inquirer = require('inquirer');
const chalk = require('chalk');

let correctLocalApk = {
  type: 'input',
  name: 'pathToApk',
  message: 'Please enter a valid APK filepath:',
}

let correctRemoteApk = {
  type: 'input',
  name: 'urlToApk',
  message: 'Please enter a valid APK URL:',
}

module.exports = {
  /**
   * Download APK from specified URL
   * @param {path} root 
   * @param {string: URL} urlToApk 
   * @returns {path} downloadPath
   */
  downloadApk: function (root, urlToApk) {
    console.log(
      chalk.cyan("Downloading APK...\n")
    );
    let downloadPath = path.join(root, 'apki-download.apk');
    // Put a progress bar here
    execSync(`curl -L ${urlToApk} > ${downloadPath}`, (err, stdout, stderr) => {
      if (err) {
        console.log(
          chalk.yellow("nodejs error downloading apk:", err.message, err.stack)
        );
      }

      if (stderr) {
        console.log(
          chalk.yellow("apktool error:", stderr)
        );
      }
    });
    return downloadPath;
  },

  /**
   * Unzip APK
   * @param {path} pathToApk 
   * @returns {path} pathToUnzippedApk
   */
  unzipApk: async function (pathToApk) {
    console.log(
      chalk.cyan("Unzipping APK with APKTool...\n")
    );
    // Put a progress bar here
    execSync(`apktool d -f ${pathToApk}`, (err, stdout, stderr) => {
      if (err) {
        console.log(
          chalk.yellow("nodejs error running apktool:", err.message, err.stack)
        );
      }

      if (stderr) {
        console.log(
          chalk.yellow("apktool error:", stderr)
        );
      }
    });
    console.log('\n');
    return pathToApk.replace('.apk', '');
  },

  /**
   * Verify the path points to a valid file, ask for user input if not
   * @param {path} root 
   * @param {path} pathToApk 
   * @returns {path} pathToApk
   */
  verifyPathToApk: async function (root, pathToApk) {
    while (!fs.existsSync(path.join(root, pathToApk))) {
      console.log(
        chalk.red('Path to APK is invalid. Please verify correct path and try again.'),
        chalk.red('Current path: ', path.join(pathToApk))
      );
      let correctPath = await inquirer.prompt([correctLocalApk]);
      pathToApk = correctPath.pathToApk;
    }
    console.log('\n');
    return pathToApk;
  },

  /**
   * Verify the URL is valid, ask for user input if not
   * @param {string: URL} urlToApk 
   * @returns urlToApk
   */
  verifyUrlToApk: async function (urlToApk) {
    while (!isUrl(urlToApk)) {
      console.log(
        chalk.red('URL is invalid. Please correct the URL and try again.'),
        chalk.red('Current URL: ', urlToApk)
      );
      let correctUrl = await inquirer.prompt([correctRemoteApk]);
      urlToApk = correctUrl.urlToApk
    }
    console.log('\n');
    return urlToApk;
  }

};