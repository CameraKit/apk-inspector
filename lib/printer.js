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
  printPermissions: function(permissionsArray, specificPermission) {
    if (specificPermission) {
      let found = false;
      permissionsArray.forEach(permission => {
        if (permission.indexOf(specificPermission) > -1) {
          console.log(
            chalk.green('Permission found!')
          );
          console.log(permission, '\n');
        }
      });
      if (!found) {
        console.log(
          chalk.yellow('Specified permisison was not found')
        )
        console.log('\n');
      }
    }

    else {
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
    }

  },

  /**
   * Format array of dependencies
   * @param {array} dependenciesArray 
   */
  printDependencies: function(dependenciesArray, specificDependency) {
    if (specificDependency) {
      let found = false;
      dependenciesArray.forEach( dependency => {
        if (dependency.indexOf(specificDependency) > -1) {
          found = true;
          console.log(
            chalk.green('Package found!')
          )
          console.log(dependency, '\n');
        }
      });

      if (!found) {
        console.log(
          chalk.yellow('Specified package was not found')
        )
      }
    }

    else {
      console.log(
        chalk.green('Package dependencies requested by this application: \n')
      );
      dependenciesArray.forEach( dependency => {
        if (dependency.indexOf('camerakit') > -1) {
          console.log(
            chalk.red(dependency)
          );
        }
        else {
          console.log(dependency);
        }
      });
      console.log('\n');
    }
  }
}