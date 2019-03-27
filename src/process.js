var methods = require("./methods.js");
var messages = require("./messages.js");

exports.removePlugins = function(options) {
    if (options.noRemove) {
        messages.outputMessage(messages.consoleMessages.skipRemove);
    } else {
        messages.outputMessage(messages.consoleMessages.findingInstalled);
        var iplugins = methods.findInstalledPlugins();

        messages.outputMessage(messages.consoleMessages.removingInstalled);
        methods.removePlugins(iplugins, options);
    }
};

exports.addPlugins = function(options) {
    if (options.noAdd) {
        messages.outputMessage(messages.consoleMessages.skipAdd);
    } else {
        messages.outputMessage(messages.consoleMessages.findingConfigPlugins);
        var plugins = methods.findConfigPlugins();

        messages.outputMessage(messages.consoleMessages.installingConfigPlugins);
        methods.installPlugins(plugins, options);
    }
};

exports.removePlatforms = function(options) {
    if (options.noRemove) {
        messages.outputMessage(messages.consoleMessages.skipRemove);
    } else {
        messages.outputMessage(messages.consoleMessages.findInstalledPlatforms);
        var iplatforms = methods.findInstalledPlatforms();
        
        messages.outputMessage(messages.consoleMessages.removingInstalledPlatforms);
        methods.removePlatforms(iplatforms, options);
    }
};

exports.addPlatforms = function(options) {
    if (options.noAdd) {
        messages.outputMessage(messages.consoleMessages.skipAdd);
    } else {
        messages.outputMessage(messages.consoleMessages.findConfigPlatforms);
        var platforms = methods.findConfigPlatforms();
        
        messages.outputMessage(messages.consoleMessages.installingConfigPlatforms);
        methods.installPlatforms(platforms, options);
    }
};

exports.sync = function(options) {
    options.noForce = true;
    
    messages.outputMessage(messages.consoleMessages.findingInstalled);
    var installedPlugins = methods.findInstalledPlugins();
    
    messages.outputMessage(messages.consoleMessages.findingConfigPlugins);
    var configPlugins = methods.findConfigPlugins();
    
    messages.outputMessage(messages.consoleMessages.findInstalledPlatforms);
    var installedPlatforms = methods.findInstalledPlatforms();
    
    messages.outputMessage(messages.consoleMessages.findConfigPlatforms);
    var configPlatforms = methods.findConfigPlatforms();
    var i;
    
    // Get diff
    var resultPlugins = methods.getDifference(installedPlugins, configPlugins, options);
    var resultPlatforms = methods.getDifference(installedPlatforms, configPlatforms, options);
    
    // Remove console messages
    if (!options.noRemove) {
        if (resultPlugins.remove.length > 0) {
            messages.outputMessage(messages.consoleMessages.diffPluginsToRemove);
            for (i = 0; i < resultPlugins.remove.length; i++) {
                console.log(resultPlugins.remove[i].name);
            }
        } else {
            messages.outputMessage(messages.consoleMessages.noPluginsToRemove);
        }
        
        if (resultPlatforms.remove.length > 0) {
            messages.outputMessage(messages.consoleMessages.diffPlatformsToRemove);
            for (i = 0; i < resultPlatforms.remove.length; i++) {
                console.log(resultPlatforms.remove[i].name);
            }
        } else {
            messages.outputMessage(messages.consoleMessages.noPlatformsToRemove);
        }
    }
    
    // Add console messages
    if (!options.noAdd) {
        if (resultPlugins.install.length > 0) {
            messages.outputMessage(messages.consoleMessages.diffPluginsToAdd);
            for (i = 0; i < resultPlugins.install.length; i++) {
                console.log(resultPlugins.install[i].name);
            }
        } else {
            messages.outputMessage(messages.consoleMessages.noPluginsToAdd);
        }
        
        if (resultPlatforms.install.length > 0) {
            messages.outputMessage(messages.consoleMessages.diffPlatformsToAdd);
            for (i = 0; i < resultPlatforms.install.length; i++) {
                console.log(resultPlatforms.install[i].name);
            }
        } else {
            messages.outputMessage(messages.consoleMessages.noPlatformsToAdd);
        }
    }
    
    // Remove platforms
    if (!options.noRemove && resultPlatforms.remove.length > 0) {
        messages.outputMessage(messages.consoleMessages.removingInstalledPlatforms);
        methods.removePlatforms(resultPlatforms.remove, options);
    } else if (resultPlatforms.remove.length > 0) {
        messages.outputMessage(messages.consoleMessages.skipRemove);
    }

    // Remove plugins
    if (!options.noRemove && resultPlugins.remove.length > 0) {
        messages.outputMessage(messages.consoleMessages.removingInstalled);
        methods.removePlugins(resultPlugins.remove, options);
    } else if (resultPlugins.remove.length > 0){
        messages.outputMessage(messages.consoleMessages.skipRemove);
    }
    
    // Add plugins
    if (!options.noAdd && resultPlugins.install.length > 0) {
        messages.outputMessage(messages.consoleMessages.installingConfigPlugins);
        methods.installPlugins(resultPlugins.install, options);
    } else if(resultPlugins.install.length > 0) {
        messages.outputMessage(messages.consoleMessages.skipAdd);
    }
    
    // Add platforms
    if (!options.noAdd && resultPlatforms.install.length > 0) {
        messages.outputMessage(messages.consoleMessages.installingConfigPlatforms);
        methods.installPlatforms(resultPlatforms.install, options);
    } else if (resultPlatforms.install.length > 0) {
        messages.outputMessage(messages.consoleMessages.skipAdd);
    }
};