#!/usr/bin/env node

var version = "1.3.0";
var methods = require("./methods.js");
var messages = require("./messages.js");
var processes = require("./process.js");
var command = process.argv[2];

var options = {
    noForce: methods.hasOption(process.argv, "noforce", "nf"),
    noRemove: methods.hasOption(process.argv, "noremove", "nr"),
    fetch: methods.hasOption(process.argv, "gitfetch", "gf"),
    noAdd: methods.hasOption(process.argv, "noadd", "na"),
    soft: methods.hasOption(process.argv, "soft", "s"),
    noiOS: methods.hasOption(process.argv, "noios", "ni"),
    noAndroid: methods.hasOption(process.argv, "noandroid", "nand"),
    reLinks: methods.hasOption(process.argv, "addlinks", "al"),
    skipList: []
};

if (options.noiOS) {
    options.skipList.push('ios');
}

if (options.noAndroid) {
    options.skipList.push('android');
}

// Display intro message
console.log("\n");
messages.outputMessage("Cordova Clean", true);

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