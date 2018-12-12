module.exports = {
  printTitle: function() {
    console.log(
      chalk.magentaBright(
        figlet.textSync('APK Inspector', {
          font: 'Standard',
          horizontalLayout: 'default',
          verticalLayout: 'default',
        }
      )
    ));
  },

  printPermissions: function(permissionsArray) {
    console.log("Permissions requested by this application: ");
    permissionsArray.forEach(permission => {
      console.log(permission);
    });
    console.log('\n');
  },

  printDependencies: function(dependenciesArray) {
    console.log("Package dependencies requested by this application: ");
    dependenciesArray.forEach( dependency => {
      console.log(dependency);
    });
    console.log('\n');
  }
}