const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');


const inspector = require('./inspector');

module.exports = {
  /*  
  *   unzipApk
  *   Unzip APK
  *   Arguments: path to zipped APK
  *   Returns: path to unzipped APK
  */
  unzipApk: function(pathToApk) {
    console.log("Unzipping APK with APKTool...\n");
    // Put a progress bar here
    execSync(`apktool d -f ${pathToApk}`, (err, stdout, stderr) => {
      if (err) {
        console.log("nodejs error running apktool:", err.message, err.stack);
        return pathToApk.split('\\').pop().split('/').pop();;
      }

      if (stderr) {
        console.log("apktool error:", stderr);
      }
    });
  },

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
  getDependencies: function(pathToUnzippedApk){
    console.log("Getting dependencies...\n");
    let packageList = [];
    let root = path.join(__dirname, pathToUnzippedApk, 'smali');
  
    inspector.getDependencies(root, packageList);
    return packageList;
  },
};