# cordova-cleanup-plugins [![npm version](https://badge.fury.io/js/cordova-cleanup-plugins.svg)](https://badge.fury.io/js/cordova-cleanup-plugins)
This is a nuke approach to the issue of inconsistent cordova plugins of a project when working in different branches. It can remove all installed plugins and install all plugins listed in the config.xml file. This avoids the case of having left over plugins from other branches installed, and if a plugin has been updated without updating the version number.

## How To Install
Install through NPM:
```
npm install cordova-cleanup-plugins
```
**This package depends on any version of cordova being installed.**

## How To Use 
Run the shell command: `cordova-clean <OPTIONS>`

All options are optional:

| Option | Short | Explanation |
|---|---|---|
| `--noremove` | `--nr` | Prevents the remove all plugins step from running. Use this if you only want to install the config.xml plugins on top of the installed plugins. |
| `--noforce` | `--nf` | Prevents force uninstall plugins. By default all plugins are removed using the `--force` flag, this way all plugins will be removed even if they are dependencies to other plugins. |
| `--gitfetch` | `--gf` | Prevents `--nofetch` from being used when installing git repository plugins. This is mostly an issue with cordova versions below 8, it will fail installing plugins from git repositories because it attempts to add them as an npm package instead of using git. By default nofetch is used to prevent this issue from happening. |
| `--noadd` | `--na` | Prevents the add plugins from config.xml step from running. Use this if you only want to remove all installed plugins, without adding plugins from the config.xml. |

## Questions?
Feel free to open an issue if you are having issues or would like to contribute!

# MIT License
Please see the LICENSE.md file for more information on licensing.
