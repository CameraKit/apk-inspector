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
    console.log('\n');
    return path.resolve('apki-download.apk');
  },

  /**
   * Unzip APK
   * @param {path} pathToApk 
   * @returns {path} pathToUnzippedApk
   */
  unzipApk: async function (pathToApk) {
    console.log(
      chalk.cyan("Unpacking APK with APKTool...\n")
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
  verifyPathToApk: async function (pathToApk) {
    let resolvedPath = path.resolve(pathToApk);
    while (!pathToApk || !fs.existsSync(resolvedPath)) {
      console.log(
        chalk.red('Path to APK is invalid. Please verify correct path and try again.'),
        chalk.red('Current path: ', resolvedPath)
      );
      let correctPath = await inquirer.prompt([correctLocalApk]);
      pathToApk = correctPath.pathToApk.trim();
      resolvedPath = path.resolve(pathToApk);
    }
    return resolvedPath;
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
      urlToApk = correctUrl.urlToApk.trim();
    }
    return urlToApk;
  }

};