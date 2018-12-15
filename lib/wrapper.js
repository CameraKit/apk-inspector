const path = require('path');
const fs = require('fs');
const inspector = require('./inspector');
const chalk = require('chalk');

module.exports = {
  /**
   * Get permissions from the unzipped APK
   * @param {path} pathToUnzippedApk 
   * @returns {array} permissionsList
   */
 getPermissions: function(pathToUnzippedApk){
   console.log(
     chalk.cyan("Getting permissions...\n")
   );
  let manifest = fs.readFileSync(path.join(pathToUnzippedApk, 'AndroidManifest.xml'), { encoding: 'UTF-8' });
  return inspector.getPermissions(manifest);
},

  /**
   * Get dependencies from the unzipped APK
   * @param {path} root 
   * @param {path} pathToUnzippedApk 
   * @returns {array} packageList
   */
  getDependencies: function(root, pathToUnzippedApk){
    let packageList = [];

    console.log(
      chalk.cyan("Getting dependencies...\n")
    );

    let folders = fs.readdirSync(path.join(root, pathToUnzippedApk));

    folders.forEach(folder => {
      if (folder.indexOf('smali') > -1) {
        let tempPackageList = [];
        let fullPath = path.join(root, pathToUnzippedApk, folder);

        inspector.getDependencies(fullPath, tempPackageList);

        tempPackageList.forEach( p => {
          packageList.push(p.slice(1, -1));
        });
      }
    });
    return packageList;
  },
};