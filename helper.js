const fs = require('fs');
const path = require('path');

let root = '';

module.exports = {
  getDependencies: function(indexRoot, packageList){
    root = indexRoot;
    getDependenciesRecurse('', '', '', packageList);
  },

  getPermissions: function(permissionBlock){
    let regex = /<uses-permission android:name="(.*)"/gm;
    const permissionsArray = permissionBlock.match(regex);
    return permissionsArray;
  },
};

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