exports.consoleMessages = {
    diffPluginsToAdd:           "Diff Plugins To Install",
    diffPluginsToRemove:        "Diff Plugins To Remove",
    diffPlatformsToAdd:         "Diff Platforms To Install",
    diffPlatformsToRemove:      "Diff Platforms To Remove",
    findingInstalled:           "Finding Installed Plugins",
    findConfigPlatforms:        "Finding Config Platforms",
    findingConfigPlugins:       "Finding Config Plugins",
    findInstalledPlatforms:     "Finding Installed Platforms",
    installingConfigPlatforms:  "Installing Config Platforms",
    installingConfigPlugins:    "Installing Config Plugins",
    noPlatformsToAdd:           "No Platforms To Add",
    noPlatformsToRemove:        "No Platforms To Remove",
    noPluginsToAdd:             "No Plugins To Add",
    noPluginsToRemove:          "No Plugins To Remove",
    nothingToAdd:               "Nothing To Add",
    nothingToRemove:            "Nothing To Remove",
    removingInstalled:          "Removing Installed Plugins",
    removingInstalledPlatforms: "Removing Installed Platforms",
    skipAdd:                    "Skipped Add",
    skipRemove:                 "Skipped Remove"
};

exports.outputMessage = function (message, spaced) {
    var output = "";
    var count = Math.trunc((56 - message.length) / 2);
    var i;
    
    for (i = 0; i < count; i++) {
        output += "=";
    }

    output += "<" + message + ">";

    for (i = 0; i < count; i++) {
        output += "=";
    }

    console.log("\n" + (output.length < 58 ? output + "=" : output) + (spaced ? "\n" : ""));
};

exports.helpMessage = "\nAvailable Commands: \n\
'clean': \n\tAtomic approach that will remove all installed plugins and platforms, and add all plugings and platforms specified in package.json. \n\
'plugins': \n\tRemoves all installed plugins and installs plugins specified in package.json. \n\
'platforms': \n\tRemoves all platforms and installs platforms specified in package.json. \n\
'sync': \n\tThis will do the same functionality as clean, but instead of removing/adding everything it will do a smart compare to see which plugins should be added/removed. Note that '-noforce' is not used here, since we do not want to remove any plugins that are dependencies. By default this will compare platform/plugin versions, but if you only want to check names add the '-soft' option to this command.\n\
'version': \n\tOutput package version. \n\n\
\nCommand Options: \n\
\n'-noremove' | '-nr'  (Commands: 'clean', 'plugins', 'platforms', 'sync'): \n\tPrevents the removal of  plugins/platforms. Use this if you only want to install the package.json plugins/platforms on top of the installed ones. \n\
\n'-noforce' | '-nf' (Commands: 'clean', 'plugins'): \n\tPrevents force uninstall plugins. By default all plugins are removed using the '-force' flag, this way all plugins will be removed even if they are dependencies to other plugins. \n\
\n'-gitfetch' | '-gf' (Commands: 'clean', 'plugins', 'sync'): \n\tPrevents '-nofetch' from being used when installing git repository plugins. This is mostly an issue with cordova versions below 8, it will fail installing plugins from git repositories because it attempts to add them as an npm package instead of using git. By default nofetch is used to prevent this issue from happening. \n\
\n'-noadd' | '-na' (Commands: 'clean', 'plugins', 'platforms', 'sync'): \n\tPrevents adding plugins/platforms. Use this if you only want to remove installed plugins/platforms, without adding from the package.json. \n\
\n'-noios' | '-ni' (Commands: 'clean', 'platforms', 'sync'): \n\tPrevents iOS from being installed / removed on platform steps. \n\
\n'-noandroid' | '-nand' (Commands: 'clean', 'platforms', 'sync'): \n\tPrevents Android from being installed / removed on platform steps. \n\
\n'-soft | '-s' (Commands:'sync'): \n\tMakes plugin / platform checks only based off of name (no version check). \n\
\n'-addlinks' | '-al' (Commands:'sync'): \n\tThis forces plugins / platforms added from git or local to be re-added during sync. \n\
\nNOTE: All options can be added with single or double dashes '-'.\n";

exports.optionMessages = {
    noForce: "NO FORCE",
    noRemove: "NO REMOVE",
    fetch: "GIT FETCH",
    noAdd: "NO ADD",
    noiOS: "NO IOS",
    noAndroid: "NO ANDROID",
    soft: "SOFT SYNC",
    addLinks: "RE-ADD GIT+LOCAL"
};

exports.outputOptions = function(options) {
    var optionMessage = "";
    var blackList = ["skipList"];
    
    for (var property in options) {
        if (options.hasOwnProperty(property) && options[property] && this.optionMessages[property] && blackList.indexOf(property) === -1) {
            optionMessage += "<" + this.optionMessages[property] + "> ";
        }
    }
    
    if (optionMessage) {
        console.log("===> Options Found: " + optionMessage);
    }
};
