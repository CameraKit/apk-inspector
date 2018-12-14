const path = require('path');
const fs = require('fs');
const inspector = require('./inspector');

module.exports = {
  /**
   * Get permissions from the unzipped APK
   * @param {path} pathToUnzippedApk 
   * @returns {array} permissionsList
   */
 getPermissions: function(pathToUnzippedApk){
  console.log("Getting permissions...\n");
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
    console.log("Getting dependencies...\n");
    let packageList = [];
    let fullPath = path.join(root, pathToUnzippedApk, 'smali');
  
    inspector.getDependencies(fullPath, packageList);
    return packageList;
  },
};