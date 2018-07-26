# cordova-clean [![npm version](https://badge.fury.io/js/cordova-clean.svg)](https://badge.fury.io/js/cordova-clean)

This tries to fix the issue of inconsistent cordova plugins/platforms of a project when working in different branches. It can remove all installed plugins/platforms and install all plugins/platforms listed in the package.json file. This avoids the case of having left over plugins/platforms from other branches installed, and if a plugin has been updated without updating the version number.

## How To Install

Install through npm:

```shell
npm install cordova-clean
```

**This package depends on any version of cordova being installed.**

## How To Use

Run the shell command: `cordova-clean <COMMAND> <OPTIONS>`

### Commands

| Command | Explanation |
|---|---|
| `clean` | Atomic approach that will remove all installed plugins and platforms, and add all plugins and platforms specified in package.json. |
| `plugins` | Removes all installed plugins and installs plugins specified in package.json. |
| `platforms` | Removes all platforms and installs platforms specified in package.json. |
| `sync` | This will do the same functionality as clean, but instead of removing/adding everything it will do a smart compare to see which plugins should be added/removed. Note that `-noforce` is not used here, since we do not want to remove any plugins that are dependencies. By default this will compare platform/plugin versions, but if you only want to check names add the `-soft` option to this command. |
| `version`, `v`, `-v`, `-version` | Output package version. |

### Options

| Option | Short Form | Command Valid In | Explanation |
|---|---|---|---|
| `-noremove` | `-nr` | `clean`, `plugins`, `platforms`, `sync` | Prevents the removal of  plugins/platforms. Use this if you only want to install the package.json plugins/platforms on top of the installed ones. |
| `-noforce` | `-nf` | `clean`, `plugins` | Prevents force uninstall plugins. By default all plugins are removed using the `-force` flag, this way all plugins will be removed even if they are dependencies to other plugins. |
| `-gitfetch` | `-gf` | `clean`, `plugins`, `sync` | Prevents `-nofetch` from being used when installing git repository plugins. This is mostly an issue with cordova versions below 8, it will fail installing plugins from git repositories because it attempts to add them as an npm package instead of using git. By default nofetch is used to prevent this issue from happening. |
| `-noadd` | `-na` | `clean`, `plugins`, `platforms`, `sync` | Prevents adding plugins/platforms. Use this if you only want to remove installed plugins/platforms, without adding from the package.json. |
| `-noios` | `-ni` | `clean`, `platforms`, `sync` | Prevents iOS from being installed / removed on platform steps. |
| `-noandroid` | `-nand` | `clean`, `platforms`, `sync` | Prevents Android from being installed / removed on platform steps. |
| `-soft` | `-s` | `sync` | Makes plugin / platform checks only based off of name (no version check). |
| `-addlinks` | `-al` | `sync` | This forces plugins / platforms added from git or local to be re-added during sync. |

You can set these options to `true` or `false` by following the option with `=` and the value: `-noios=true` `-noandroid=false`. This can be used to override options that are defined in the `cordova-clean.json` configuration file.

All options can be added with single or double dashes '-'.

## Quirks

Version checking with the `sync` command works by checking the version listed in `cordova [platform|plugin] ls` against the version in the package.json file. Plugins and platforms added through local or github repositories will always be skipped by default if the plugin / platform is present (they will be assumed to be up to date). This is because we cannot reliably compare the installed version number to the repository link. If you would like to change the behaviour to re-add these plugins instead of skipping in this situation, add the `-addlinks` option when performing the `sync` command.

## Clean Config File

You can put `cordova-clean.json` at the root of your project to set options automatically. All values can be set to either `true` or `false`. If any other value is used, it will default to `false`. These options will apply to every command that is executed. If you do not wish for one of these options to apply, use the command line argument to set the variable (ie `-noandroid=true`), since command line options override those in the `cordova-clean.json` file.

| Option      |
| ----------- |
| `noForce`   |
| `noRemove`  |
| `fetch`     |
| `noAdd`     |
| `soft`      |
| `noiOS`     |
| `noAndroid` |
| `addLinks`  |

**Example:**

```json
{
    "noForce": true,
    "noiOS": true,
    "noAndroid": false
}
```

## Questions?

Feel free to open an issue if you are having issues or would like to contribute!

## MIT License

Please see the LICENSE.md file for more information on licensing.
