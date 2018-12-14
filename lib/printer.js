const figlet = require('figlet');
const chalk = require('chalk');

module.exports = {
  /**
   * Print title with chalk and figlet
   */
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

  /**
   * Format array of permissions
   * @param {array} permissionsArray 
   */
  printPermissions: function(permissionsArray) {

    console.log(
      chalk.green('Permissions requested by this application: \n')
    );
    permissionsArray.forEach(permission => {
      if (permission.indexOf('CAMERA') > -1) {
        console.log(
          chalk.red(permission)
        );
      }
      else {
        console.log(permission);
      }
    });
    console.log('\n');
  },

  /**
   * Format array of dependencies
   * @param {array} dependenciesArray 
   */
  printDependencies: function(dependenciesArray) {
    console.log(
      chalk.green('Package dependencies requested by this application: \n')
    );
    dependenciesArray.forEach( dependency => {
      if (dependency.indexOf('android.support') > -1) {
        console.log(
          chalk.yellow(dependency)
        )
      }
      else if (dependency.indexOf('camerakit') > -1) {
        console.log(
          chalk.red(dependency)
        );
      }
      else if (dependency.indexOf('com.google.android.gms') > -1) {
        console.log(
          chalk.green(dependency)
        );
      }
      else {
        console.log(dependency);
      }
    });
    console.log('\n');
  }
}