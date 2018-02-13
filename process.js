var methods = require("./methods.js");
var messages = require("./messages.js");

exports.fullClean = function(config, options) {
    this.plugins(config, options);
    this.platforms(config, options);
};

exports.sync = function(config, options) {
    console.log(messages.consoleMessages.findingInstalled);
    var iplugins = methods.findInstalledPlugins();
    
    console.log(messages.consoleMessages.findingConfigPlugins);
    var plugins = methods.findConfigPlugins(config);
    
    console.log(messages.consoleMessages.findInstalledPlatforms);
    var iplatforms = methods.findInstalledPlatforms();
    
    console.log(messages.consoleMessages.findConfigPlatforms);
    var platforms = methods.findConfigPlatforms(config);
    
    console.log(messages.consoleMessages.findingPluginDiff);
    var diff = options.soft ? methods.getDifference(iplugins, plugins, options.soft) : methods.getPluginDifference(iplugins, plugins);
    
    if (diff.toAdd.length === 0 && diff.toRemove.length === 0) {
        console.log(messages.consoleMessages.noPluginDiff);
    } else {
        if (diff.toRemove.length === 0) {
            console.log(messages.consoleMessages.nothingToRemove);
        } else {
            console.log(messages.consoleMessages.removingDiff);
            methods.removePlugins(diff.toRemove, options);
        }
        
        if (diff.toAdd.length === 0) {
            console.log(messages.consoleMessages.nothingToAdd);
        } else {
            console.log(messages.consoleMessages.addingDiff);
            methods.installPlugins(diff.toAdd, options);
        }
    }
    
    console.log(messages.consoleMessages.findingPlatformDiff);
    diff = methods.getDifference(iplatforms, platforms, options.soft);
    
    if (diff.toAdd.length === 0 && diff.toRemove.length === 0) {
        console.log(messages.consoleMessages.noPlatformDiff);
    } else {
        if (diff.toRemove.length === 0) {
            console.log(messages.consoleMessages.nothingToRemove);
        } else {
            console.log(messages.consoleMessages.removingDiff);
            methods.removePlugins(diff.toRemove, options);
        }
        
        if (diff.toAdd.length === 0) {
            console.log(messages.consoleMessages.nothingToAdd);
        } else {
            console.log(messages.consoleMessages.addingDiff);
            methods.installPlugins(diff.toAdd, options);
        }
    }
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
    console.log(messages.consoleMessages.findInstalledPlatforms);
    var iplatforms = methods.findInstalledPlatforms();
    
    console.log(messages.consoleMessages.findConfigPlatforms);
    var platforms = methods.findConfigPlatforms(config);
    
    console.log(messages.consoleMessages.removingInstalledPlatforms);
    methods.removePlatforms(iplatforms);
    
    console.log(messages.consoleMessages.installingConfigPlatforms);
    methods.installPlatforms(platforms);
};