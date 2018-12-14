const path = require('path');
const fs = require('fs');
const inspector = require('./inspector');

module.exports = {


  /*  
  *   getPermissions
  *   Get Permissions from unzipped APK
  *   Arguments: path to unzipped APK
  *   Returns: array of permissions
  */
 getPermissions: function(pathToUnzippedApk){
  console.log("Getting permissions...\n");
  let manifest = fs.readFileSync(path.join(pathToUnzippedApk, 'AndroidManifest.xml'), { encoding: 'UTF-8' });
  return inspector.getPermissions(manifest);
},

  /*  
  *   getDependencies
  *   Get Dependencies from unzipped APK
  *   Arguments: path to unzipped APK
  *   Returns: array of package names
  */
  getDependencies: function(root, pathToUnzippedApk){
    console.log("Getting dependencies...\n");
    let packageList = [];
    let fullPath = path.join(root, pathToUnzippedApk, 'smali');
  
    inspector.getDependencies(fullPath, packageList);
    return packageList;
  },
};