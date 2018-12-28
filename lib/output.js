const fs = require ('fs');
const path = require('path');

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
   * Write object to JSON file
   * @param {array} permissionsArray 
   * @param {array} dependenciesArray
   * @param {string} filePath 
   */
  writeToJSON: function(permissionsArray, dependenciesArray, filePath) {
    filePath = path.resolve(filePath);
    var object = new Object();
    if (permissionsArray != null) {
      object.permissions = permissionsArray;
    }

    if (dependenciesArray != null) {
      object.dependencies = dependenciesArray;
    } 
    fs.writeFileSync(filePath, JSON.stringify(object));
  },

  /**
   * Write output to text file
   * @param {array} permissionsArray 
   * @param {array} dependenciesArray 
   * @param {string} filePath 
   */
  writeToText: function(permissionsArray, dependenciesArray, filePath) {
    filePath = path.resolve(filePath);

    fs.writeFileSync(filePath, 'Permissions: \n');
    permissionsArray.forEach( permission => {
      fs.appendFileSync(filePath, permission + '\n');
    });

    fs.appendFileSync(filePath, '\nDependencies: \n');
    dependenciesArray.forEach( dependency => {
      fs.appendFileSync(filePath, dependency + '\n');
    });
  },

  /**
   * Format array of permissions
   * @param {array} permissionsArray 
   * @param {string} specificPermission
   */
  printPermissions: function(permissionsArray, specificPermission) {
    if (specificPermission) {
      let found = false;
      permissionsArray.forEach(permission => {
        if (permission.indexOf(specificPermission) > -1) {
          found = true;
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
        console.log(permission);
      });      
      console.log('\n');
    }

  },

  /**
   * Format array of dependencies
   * @param {array} dependenciesArray 
   * @param {string} specificDependency
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
        console.log(dependency);
      });
      console.log('\n');
    }
  }
}