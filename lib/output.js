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
    console.log(
      chalk.cyan('Wrote output to JSON.')
    );
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
    console.log(
      chalk.cyan('Wrote output to text.')
    );
  },

   /**
   * Format array of permissions
   * @param {array} permissionsArray 
   * @param {string} specificPermission
   */
  print: function(permissionsArray, dependenciesArray) {
    if (permissionsArray != null) {  
      console.log(
        chalk.green('Permissions requested by this application: \n')
      );  
      permissionsArray.forEach(permission => {
        console.log(permission);
      });      
      console.log('\n');
    }
    if (dependenciesArray != null) {
      console.log(
        chalk.green('Package dependencies requested by this application: \n')
      );
      dependenciesArray.forEach(dependency => {
        console.log(dependency);
      });
      console.log('\n');
    }
  },

  /**
   * Print whether or not specified dependency was found
   * @param {array} dependenciesArray 
   * @param {string} specificDependency 
   */
  printSpecificDependency: function(dependenciesArray, specificDependency) {
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
          chalk.yellow('Specified package not found')
        )
      }
  },

  /**
   * Print whether or not specified permission was found
   * @param {array} permissionsArray 
   * @param {string} specificPermission 
   */
  printSpecificPermission: function(permissionsArray, specificPermission) {
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
          chalk.yellow('Specified permisison not found')
        )
        console.log('\n');
      }
  }
}