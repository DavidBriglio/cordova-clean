#!/usr/bin/env node

var version = "1.3.2";
var methods = require("./methods.js");
var messages = require("./messages.js");
var processes = require("./process.js");
var command = process.argv[2];

// Display intro message
console.log("\n");
messages.outputMessage("Cordova Clean", true);

// Check for clean config file
var options = methods.getCleanConfig("cordova-clean.json");
var cmdOptions = methods.getOptions(process.argv);

// Override config file options with command line options
options = {
    noForce: methods.hasOption(cmdOptions, "noforce", "nf", options.noForce),
    noRemove: methods.hasOption(cmdOptions, "noremove", "nr", options.noRemove),
    fetch: methods.hasOption(cmdOptions, "gitfetch", "gf", options.fetch),
    noAdd: methods.hasOption(cmdOptions, "noadd", "na", options.noAdd),
    soft: methods.hasOption(cmdOptions, "soft", "s", options.soft),
    noiOS: methods.hasOption(cmdOptions, "noios", "ni", options.noiOS),
    noAndroid: methods.hasOption(cmdOptions, "noandroid", "nand", options.noAndroid),
    addLinks: methods.hasOption(cmdOptions, "addlinks", "al", options.addLinks),
    skipList: []
};

if (options.noiOS) {
    options.skipList.push("ios");
}

if (options.noAndroid) {
    options.skipList.push("android");
}

// Display which cli options were included
messages.outputOptions(options);

// Extract the config.xml content
var config = methods.loadConfig();
if (!config) {
    messages.outputMessage("Done", true);
    return;
}

// Process version command before others, that way we don't log intro / outro messages
switch (command) {
    case "--version":
    case "-version":
    case "v":
    case "version":
    case "--v":
    case "-v":
        console.log(version);
        return;
}

switch (command) {
    case "clean":
        processes.removePlatforms(config, options);
        processes.removePlugins(config, options);
        processes.addPlugins(config, options);
        processes.addPlatforms(config, options);
        break;
    case "plugins":
        processes.removePlugins(config, options);
        processes.addPlugins(config, options);
        break;
    case "platforms":
        processes.removePlatforms(config, options);
        processes.addPlatforms(config, options);
        break;
    case "sync":
        processes.sync(config, options);
        break;
    default:
        console.log(messages.helpMessage);
}

console.log("\n");
messages.outputMessage("Done", true);