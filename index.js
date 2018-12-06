var { exec } = require('child_process');
var inquirer = require('inquirer');


inquirer
  .prompt([
    {
      type: 'input',
      name: 'apk',
      message: 'APK file to analyze'
    }
    
  ])
  .then(answers => {
    analyzeApk(answers);
  });


function analyzeApk(answers) {
  exec(`./aapt d xmltree ${answers.apk} AndroidManifest.xml > manifest_output.txt`, (err, stdout, stderr) => {
    if (err) {
      console.log(err);
    }
  });
}
