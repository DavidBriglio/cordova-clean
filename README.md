# cordova-clean [![npm version](https://badge.fury.io/js/cordova-clean.svg)](https://badge.fury.io/js/cordova-clean)
This tries to fix the issue of inconsistent cordova plugins/platforms of a project when working in different branches. It can remove all installed plugins/platforms and install all plugins/platforms listed in the config.xml file. This avoids the case of having left over plugins/platforms from other branches installed, and if a plugin has been updated without updating the version number.

## How To Install
Install through npm:
```
npm install cordova-clean
```
**This package depends on any version of cordova being installed.**

## How To Use 
Run the shell command: `cordova-clean <COMMAND> <OPTIONS>`

### Commands

| Command | Explanation |
|---|---|
| `clean` | Atomic approach that will remove all installed plugins and platforms, and add all plugings and platforms specified in config.xml. |
| `plugins` | Removes all installed plugins and installs plugins specified in config.xml. |
| `platforms` | Removes all platforms and installs platforms specified in config.xml. |

### Options

| Option | Short Form | Command Valid In | Explanation |
|---|---|---|---|
| `--noremove` | `--nr` | `clean`, `plugins`, `platforms` | Prevents the removal of  plugins/platforms. Use this if you only want to install the config.xml plugins/platforms on top of the installed ones. |
| `--noforce` | `--nf` | `clean`, `plugins` | Prevents force uninstall plugins. By default all plugins are removed using the `--force` flag, this way all plugins will be removed even if they are dependencies to other plugins. |
| `--gitfetch` | `--gf` | `clean`, `plugins` | Prevents `--nofetch` from being used when installing git repository plugins. This is mostly an issue with cordova versions below 8, it will fail installing plugins from git repositories because it attempts to add them as an npm package instead of using git. By default nofetch is used to prevent this issue from happening. |
| `--noadd` | `--na` | `clean`, `plugins`, `platforms` | Prevents adding plugins/platforms. Use this if you only want to remove installed plugins/platforms, without adding from the config.xml. |

# Questions?
Feel free to open an issue if you are having issues or would like to contribute!

# MIT License
Please see the LICENSE.md file for more information on licensing.
