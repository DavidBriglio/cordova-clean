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
        methods.removePlatforms(iplatforms);
    }
    
    if (options.noAdd) {
        console.log(messages.consoleMessages.skipAdd);
    } else {
        console.log(messages.consoleMessages.findConfigPlatforms);
        var platforms = methods.findConfigPlatforms(config);
        
        console.log(messages.consoleMessages.installingConfigPlatforms);
        methods.installPlatforms(platforms);
    }
};