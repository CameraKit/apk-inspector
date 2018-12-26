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
```
Usage: apki [options]

Options:
  -c, --camerakit           Only shows CamearaKit package and Camera permissions [boolean] [default: false]
  -l, --local-source        <path_to_apk> relative path to local apk source
  -r, --remote-source       <url> remote apk souce
  -p, --permissions-only    only output permissions   [boolean] [default: false]
  -d, --dependencies-only   only output dependencies  [boolean] [default: false]
  -x, --specify-permission  <string> name of permission to search
  -y, --specify-dependency  <string> name of dependency to search
  -v, --version             Show version number                        [boolean]
  -h, --help                Show help                                  [boolean]

Examples:
  apki -r https://pathtoapk.io -x camera
  apki -l ./Downloads/myapk.apk -d
  node index.js
```

## License
APK Inspector is under the MIT License. 
