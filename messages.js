
exports.consoleMessages = {
    done:                       "\n==========================<Done>==========================\n",
    intro:                      "\n================<Cleaning Cordova Plugins>================\n",
    skipRemove:                 "\n=====================<Skipped Remove>=====================",
    findingInstalled:           "\n================<Finding Installed Plugins>===============",
    removingInstalled:          "\n===============<Removing Installed Plugins>===============",
    skipAdd:                    "\n======================<Skipped Add>=======================",
    findingConfigPlugins:       "\n=================<Finding Config Plugins>=================",
    installingConfigPlugins:    "\n================<Installing Config Plugins>===============",
    findingPluginDiff:          "\n==================<Finding Diff Plugins>==================",
    findingPlatformDiff:        "\n=================<Finding Diff Platforms>=================",
    addingDiff:                 "\n================<Installing Diff Plugins>=================",
    removingDiff:               "\n=================<Removing Diff Plugins>==================",
    noPluginDiff:               "\n===============<No Plugin Difference Found>===============",
    noPlatformDiff:             "\n==============<No Platform Difference Found>==============",
    nothingToAdd:               "\n=====================<Nothing To Add>=====================",
    nothingToRemove:            "\n===================<Nothing To Remove>====================",
    findInstalledPlatforms:     "\n===============<Finding Installed Platforms>==============",
    findConfigPlatforms:        "\n================<Finding Config Platforms>================",
    removingInstalledPlatforms: "\n==============<Removing Installed Platforms>==============",
    installingConfigPlatforms:  "\n==============<Installing Config Platforms>==============="
};

exports.helpMessage = "Available Commands: \n\
'clean': Atomic approach that will remove all installed plugins and platforms, and add all plugings and platforms specified in config.xml. \n\
'plugins': Removes all installed plugins and installs plugins specified in config.xml. \n\
'platforms': Removes all platforms and installs platforms specified in config.xml. \n\
'sync': Smart check that compares the currently installed plugins and platforms and tries to make sure the config.xml plugins/platforms are installed with the proper versions. This will be faster than 'clean' but may not install the proper plugin versions if the plugin version has been updated without updating the version number. \n\
\nCommand Options: \n\
'--noremove' | '--nr'  (Commands: 'clean', 'plugins', 'platforms', 'sync'): \nPrevents the removal of  plugins/platforms. Use this if you only want to install the config.xml plugins/platforms on top of the installed ones. \n\
\n'--noforce' | '--nf' | (Commands: 'clean', 'plugins', 'sync'): \nPrevents force uninstall plugins. By default all plugins are removed using the '--force' flag, this way all plugins will be removed even if they are dependencies to other plugins. \n\
\n'--gitfetch' | '--gf' | (Commands: 'clean', 'plugins', 'sync'): \nPrevents '--nofetch' from being used when installing git repository plugins. This is mostly an issue with cordova versions below 8, it will fail installing plugins from git repositories because it attempts to add them as an npm package instead of using git. By default nofetch is used to prevent this issue from happening. \n\
\n'--noadd' | '--na' | (Commands: 'clean', 'plugins', 'platforms', 'sync'): \nPrevents adding plugins/platforms. Use this if you only want to remove installed plugins/platforms, without adding from the config.xml. \n\
\n'--soft' | '--s' | (Commands: 'sync'): \nWill only compare the plugin/platform name, not the version. Use this if you do not care what version of the plugin/platform you want to use.\n";

exports.optionMessages = {
    noForce: "NO FORCE",
    noRemove: "NO REMOVE",
    fetch: "GIT FETCH",
    noAdd: "NO ADD",
    soft: "SOFT"
};

exports.outputOptions = function(options) {
    var optionMessage = "";
    
    for (var property in options) {
        if (options.hasOwnProperty(property) && options[property] && this.optionMessages[property]) {
            optionMessage += "<" + this.optionMessages[property] + "> ";
        }
    }
    
    if (optionMessage) {
        console.log("===> Options Found: " + optionMessage);
    }
};
