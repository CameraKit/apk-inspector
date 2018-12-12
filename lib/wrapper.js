module.exports = {
  /*  
  *   getPermissions
  *   Get Permissions from unzipped APK
  *   Arguments: path to unzipped APK
  *   Returns: array of permissions
  */
 getPermissions: function(pathToUnzippedApk){
  console.log("Getting permissions...\n");
  let manifest = fs.readFileSync(path.join(__dirname, pathToUnzippedApk, 'AndroidManifest.xml'), { encoding: 'UTF-8' });
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