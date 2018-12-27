const fs = require('fs');
const path = require('path');
let root = '';

module.exports = {
  /**
   * Function that starts recursion to get dependencies
   * @param {path} indexRoot 
   * @param {array} packageList 
   */
  getDependencies: function(indexRoot, packageList){
    root = indexRoot;
    getDependenciesRecurse('', '', '', packageList);
  },

  /**
   * Get permissions from Android Manifest file
   * @param {string} androidManifest 
   */
  getPermissions: function(androidManifest){
    let myRe = new RegExp('<uses-permission android:name="(.*)"', 'gm');
    let tempArray;
    let permissionsArray = [];

    while ((tempArray = myRe.exec(androidManifest)) != null) {
      permissionsArray.push(tempArray[1]);      
    }
    return permissionsArray;
  },
};

/**
 * Recursive function to find all dependencies
 * @param {path} directoryPath 
 * @param {string} directoryName 
 * @param {string} packageName 
 * @param {array} packageList 
 */
function getDependenciesRecurse(directoryPath, directoryName, packageName, packageList) {
  let containsSmali = false;
  
  packageName = packageName + directoryName + '.';
  directory = path.join(root, directoryPath);

  if (!fs.statSync(directory).isDirectory()) {
    return;
  }

  fileStats = fs.statSync(path.join(directory));
  files = fs.readdirSync(directory);

  files.forEach( file => {
    if(file.indexOf('.smali') > -1 ) {
      containsSmali = true;
    }
  });

  if (containsSmali) {
    packageList.push(packageName);
    return;
  }

  files.forEach( file => {
    getDependenciesRecurse(path.join(directoryPath, file), file, packageName, packageList);
  });
  return packageList;
}