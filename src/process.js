var methods = require("./methods.js");
var messages = require("./messages.js");

exports.fullClean = function(config, options) {
    this.plugins(config, options);
    this.platforms(config, options);
};

exports.plugins = function(config, options) {
    if (options.noRemove) {
        console.log(messages.consoleMessages.skipRemove);
    } else {
        console.log(messages.consoleMessages.findingInstalled);
        var iplugins = methods.findInstalledPlugins();

        console.log(messages.consoleMessages.removingInstalled);
        methods.removePlugins(iplugins, options);
    }

    if (options.noAdd) {
        console.log(messages.consoleMessages.skipAdd);
    } else {
        console.log(messages.consoleMessages.findingConfigPlugins);
        var plugins = methods.findConfigPlugins(config);

        console.log(messages.consoleMessages.installingConfigPlugins);
        methods.installPlugins(plugins, options);
    }
};

exports.platforms = function(config, options) {
    if (options.noRemove) {
        console.log(messages.consoleMessages.skipRemove);
    } else {
        console.log(messages.consoleMessages.findInstalledPlatforms);
        var iplatforms = methods.findInstalledPlatforms();
        
        console.log(messages.consoleMessages.removingInstalledPlatforms);
        methods.removePlatforms(iplatforms, options);
    }
    
    if (options.noAdd) {
        console.log(messages.consoleMessages.skipAdd);
    } else {
        console.log(messages.consoleMessages.findConfigPlatforms);
        var platforms = methods.findConfigPlatforms(config);
        
        console.log(messages.consoleMessages.installingConfigPlatforms);
        methods.installPlatforms(platforms, options);
    }
};

exports.sync = function(config, options) {
    options.noForce = true;
    options.soft = true; // TODO: Implement version checking for hard sync
    
    console.log(messages.consoleMessages.findingInstalled);
    var installedPlugins = methods.findInstalledPlugins();
    
    console.log(messages.consoleMessages.findingConfigPlugins);
    var configPlugins = methods.findConfigPlugins(config);
    
    console.log(messages.consoleMessages.findInstalledPlatforms);
    var installedPlatforms = methods.findInstalledPlatforms();
    
    console.log(messages.consoleMessages.findConfigPlatforms);
    var configPlatforms = methods.findConfigPlatforms(config);
    var i;
    
    // Get diff
    var resultPlugins = methods.getDifference(installedPlugins, configPlugins, options);
    var resultPlatforms = methods.getDifference(installedPlatforms, configPlatforms, options);
    
    // Remove console messages
    if (!options.noRemove) {
        if (resultPlugins.remove.length > 0) {
            console.log(messages.consoleMessages.diffPluginsToRemove);
            for (i = 0; i < resultPlugins.remove.length; i++) {
                console.log(resultPlugins.remove[i].name);
            }
        } else {
            console.log(messages.consoleMessages.noPluginsToRemove);
        }
        
        if (resultPlatforms.remove.length > 0) {
            console.log(messages.consoleMessages.diffPlatformsToRemove);
            for (i = 0; i < resultPlatforms.remove.length; i++) {
                console.log(resultPlatforms.remove[i].name);
            }
        } else {
            console.log(messages.consoleMessages.noPlatformsToRemove);
        }
    }
    
    // Add console messages
    if (!options.noAdd) {
        if (resultPlugins.install.length > 0) {
            console.log(messages.consoleMessages.diffPluginsToAdd);
            for (i = 0; i < resultPlugins.install.length; i++) {
                console.log(resultPlugins.install[i].name);
            }
        } else {
            console.log(messages.consoleMessages.noPluginsToAdd);
        }
        
        if (resultPlatforms.install.length > 0) {
            console.log(messages.consoleMessages.diffPlatformsToAdd);
            for (i = 0; i < resultPlatforms.install.length; i++) {
                console.log(resultPlatforms.install[i].name);
            }
        } else {
            console.log(messages.consoleMessages.noPlatformsToAdd);
        }
    }
    
    // Remove plugins
    if (!options.noRemove && resultPlugins.remove.length > 0) {
        console.log(messages.consoleMessages.removingInstalled);
        methods.removePlugins(resultPlugins.remove, options);
    } else if (resultPlugins.remove.length > 0){
        console.log(messages.consoleMessages.skipRemove);
    }
    
    // Add plugins
    if (!options.noAdd && resultPlugins.install.length > 0) {
        console.log(messages.consoleMessages.installingConfigPlugins);
        methods.installPlugins(resultPlugins.install, options);
    } else if(resultPlugins.install.length > 0) {
        console.log(messages.consoleMessages.skipAdd);
    }
    
    // Remove platforms
    if (!options.noRemove && resultPlatforms.remove.length > 0) {
        console.log(messages.consoleMessages.removingInstalledPlatforms);
        methods.removePlatforms(resultPlatforms.remove, options);
    } else if (resultPlatforms.remove.length > 0) {
        console.log(messages.consoleMessages.skipRemove);
    }
    
    // Add platforms
    if (!options.noAdd && resultPlatforms.install.length > 0) {
        console.log(messages.consoleMessages.installingConfigPlatforms);
        methods.installPlatforms(resultPlatforms.install, options);
    } else if (resultPlatforms.install.length > 0) {
        console.log(messages.consoleMessages.skipAdd);
    }
};