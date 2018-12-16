# apk-inspector-web

## Installation
This project currently depends on APKTool. APKTool is an open source library that allows disassembly of APKs. 

Follow the installation instructions on their [website](https://ibotpeaches.github.io/Apktool/install/). 

Install the other project dependencies with `yarn`. 

## Usage
Start the script with `apki` or `node index.js`.

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
  apki --camerakit
  apki -c
  apki -r https://pathtoapk.io --c
```