# Changelog

## v1.3.0 - 07/25/2018

- Changed intro text and moved option output after intro output
- Added version checking to plugins / platforms in `sync` command
  - New `-soft` and `-addlinks` options for `sync` command
- Adding plugins now adds their variables specified in package.json
- Configuration reference is now package.json, instead of config.xml

## v1.2.3 - 06/28/2018

- Re-ordered operations in 'clean' and 'sync' to increase speed

## v1.2.2 - 05/11/2018

- Added -noios and -noandroid options, this prevents those platforms from being added / removed

## v1.2.1 - 03/07/2018

- Fixed issue with installing plugins from file paths (replaced '\\' with '/')
- Added package version command
- Options can now be entered with single or double '-', ie: '--option1' and '-option1'

## v1.2.0 - 03/05/2018

- Added `sync` command

## v1.1.1 - 03/01/2018

- Fixed issue with installing plugins from file paths

## v1.1.0 - 02/08/2018

- Added commands for clean/platform/plugin
- renamed to 'cordova-clean' since it will not be plugin specific

## v1.0.1 - 02/08/2018

- Added `--noadd` option to skip adding plugins

## v1.0.0 - 02/08/2018

- Initial release