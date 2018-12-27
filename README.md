<p align="center">
    <img alt='APK Inspector Header' src='.repo/gh-readme-header.png' />
</p>
Find permissions and dependencies used by an Android application. 

## Installation
This project currently depends on APKTool. APKTool is an open source library that allows disassembly of APKs. 

Follow the installation instructions on their [website](https://ibotpeaches.github.io/Apktool/install/). 

Install the other project dependencies with `yarn`. 

## Usage
Install the script globally with `npm install -g` and then run with the command with `apki`.

Otherwise run the script from the project directory with the command `node index.js`.

## Options
`apki [option] <parameter>` 

| option | alias | parameters | description |
| --- | --- | --- | --- | 
| --local-source | -l | __string__: path_to_apk | path to local APK |
| --remote-source | -r | __string__: URL | URL of remote source |
|  --specify-permission | -x | __string__: permission_name | specific permission to find |
|  --specify-dependency | -y | __string__: package_name | specific package to find |
| --permissions-only | -p | none | only output permissions |
| --dependencies-only | -d | none | only output dependencies |
| --version | -v | none | Show version number |
| --help | -h | none | Show help |

Examples
```
  apki -r https://pathtoapk.io -x camera
  apki -l ./Downloads/myapk.apk -d
  node index.js
```

## License
APK Inspector is under the MIT License. 
