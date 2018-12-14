const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const isUrl = require('is-url');
const inquirer = require('inquirer');

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
  /*  
  *   downloadApk
  *   Unzip APK
  *   Arguments: path to zipped APK
  *   Returns: path to unzipped APK
  */
  downloadApk: function (root, urlToApk) {
    console.log("Downloading APK...\n");
    let downloadPath = path.join(root, 'apki-download.apk');
    // Put a progress bar here
    execSync(`curl -L ${urlToApk} > ${downloadPath}`, (err, stdout, stderr) => {
      if (err) {
        console.log("nodejs error downloading apk:", err.message, err.stack);
      }

      if (stderr) {
        console.log("apktool error:", stderr);
      }
    });
    return downloadPath;
  },

  /*  
  *   unzipApk
  *   Unzip APK
  *   Arguments: path to zipped APK
  *   Returns: path to unzipped APK
  */
  unzipApk: async function (pathToApk) {
    console.log("Unzipping APK with APKTool...\n");
    // Put a progress bar here
    execSync(`apktool d -f ${pathToApk}`, (err, stdout, stderr) => {
      if (err) {
        console.log("nodejs error running apktool:", err.message, err.stack);
      }

      if (stderr) {
        console.log("apktool error:", stderr);
      }
    });
    return pathToApk.replace('.apk', '');
  },

  verifyPathToApk: async function (root, pathToApk) {
    while (!fs.existsSync(path.join(root, pathToApk))) {
      console.log('Path to APK is invalid. Please verify correct path and try again.');
      console.log('Current path: ', path.join(pathToApk));
      let correctPath = await inquirer.prompt([correctLocalApk]);
      pathToApk = correctPath.pathToApk;
    }

    return pathToApk;
  },

  verifyUrlToApk: async function (urlToApk) {
    while (!isUrl(urlToApk)) {
      console.log('URL is invalid. Please correct the URL and try again.');
      console.log('Current URL: ', urlToApk);
      let correctUrl = await inquirer.prompt([correctRemoteApk]);
      urlToApk = correctUrl.urlToApk
    }

    return urlToApk;
  }

};