var fs = require('fs');
var cmd = require('child_process');

exports.hasOption = function(args, full, short) {
    return (args.indexOf("--" + full) >= 0 || args.indexOf("-" + full) >= 0 || args.indexOf("--" + short) >= 0 || args.indexOf("-" + short) >= 0);
};

exports.loadConfig = function() {
    var content = null;
    if (!fs.existsSync(process.cwd() + "/config.xml")) {
        console.error("\n==> ERROR: No config.xml found!");
        return content;
    }

    try {
        content = fs.readFileSync(process.cwd() + "/config.xml");
    } catch (e) {
        //
    }

    return content;
};

exports.findInstalledPlugins = function() {
    var output = cmd.execSync("cordova plugin ls").toString('utf8');
    var pattern = /(\S*)\s*(\S*)\s".*"/gi;
    var match = pattern.exec(output);
    var plugins = [];
    while (match !== null) {
        var found = {
            name: match[1],
            version: match[2]
        };
        console.log("FOUND " + found.name + " @ " + found.version);
        plugins.push(found);
        match = pattern.exec(output);
    }
    return plugins;
};

exports.findInstalledPlatforms = function() {
    var output = cmd.execSync("cordova platform ls").toString('utf8');
    var pattern = /(\S*)\s.?(\d)\.(\d).(\d)/gi;
    var index = output.indexOf("Available");
    if (index >= 0) {
        output = output.substring(0, index);
    }
    var match = pattern.exec(output);
    var platforms = [];
    while (match !== null) {
        var found = {
            name: match[1],
            version: (match[2] + "." + match[3] + "." + match[4])
        };
        console.log("FOUND " + found.name + " @ " + found.version);
        platforms.push(found);
        match = pattern.exec(output);
    }
    return platforms;
};

exports.findConfigPlatforms = function(content) {
    var pattern = /<engine[ ]+name=\"(.+)\"[ ]+spec=\"(.+)\"/gi;
    var match = pattern.exec(content);
    var platforms = [];
    while (match !== null) {
        console.log("FOUND " + match[1] + " @ " + match[2]);
        platforms.push({
            name: match[1],
            version: match[2]
        });
        match = pattern.exec(content);
    }
    return platforms;
};

exports.removePlugins = function(plugins, options) {
    for (var index in plugins) {
        console.log("\n===> Removing " + plugins[index].name);
        try {
            cmd.execSync("cordova plugin rm " + plugins[index].name + " --nosave" + (options.noForce ? "" : " --force"), {
                stdio: [0, 1, 2]
            });
        } catch (e) {
            // Do nothing, we do not want to stop if there was an error removing a plugin
        }
    }
};

exports.findConfigPlugins = function(content) {
    var pattern = /<plugin[ ]+name=\"(.+)\"[ ]+spec=\"(.+)\"/gi;
    var match = pattern.exec(content);
    var plugins = [];
    while (match !== null) {
        console.log("FOUND " + match[1] + " @ " + match[2]);
        plugins.push({name:match[1], version:match[2]});
        match = pattern.exec(content);
    }
    return plugins;
};

exports.removePlatforms = function(platforms) {
    for (var index in platforms) {
        var platform = platforms[index];
        console.log("\n===> Removing " + platform.name);
        try {
            cmd.execSync("cordova platform rm " + platform.name + " --nosave", {
                stdio: [0, 1, 2]
            });
        } catch (e) {
            // Do nothing, we do not want to stop if there was an error removing a platform
        }
    }
};

exports.installPlatforms = function(platforms) {
    for (var index in platforms) {
        var platform = platforms[index];
        console.log("\n===> Installing " + platform.name + " @ " + platform.version);
        try {
            cmd.execSync("cordova platform add " + platform.name + "@" + platform.version + " --nosave", {
                stdio: [0, 1, 2]
            });
        } catch (e) {
            // Do nothing, we do not want to stop if there was an error installing the platform
        }
    }
};

exports.installPlugins = function(plugins, options) {
    for (var index in plugins) {
        var plugin = plugins[index];
        var pluginLine = "";
        console.log("\n===> Installing " + plugin.name + " @ " + plugin.version);
        
        if (plugin.version.match("git+")) {
            pluginLine = plugin.version + (options.fetch ? "" : " --nofetch");
        } else if (plugin.version.match("file:")) {
            pluginLine = plugin.version.replace("file:", "").replace('\\', '/') + " --nofetch";
        } else {
            pluginLine = plugin.name + "@" + plugin.version;
        }
        
        try {
            cmd.execSync("cordova plugin add " + pluginLine + " --nosave", {
                stdio: [0, 1, 2]
            });
        } catch (e) {
            // Do nothing, we do not want to stop if there was an error installing the plugin
        }
    }
};

exports.findMatch = function(item, itemSet, soft) {
    for (var i = 0; i < itemSet.length; i++) {
        if (itemSet[i].name === item.name && (soft === true || itemSet[i].version === item.version)) {
            return i;
        }
    }
    
    return null;
};

exports.getDifference = function(installed, config, options) {
    var result = { install:config, remove:[] };
    
    for (var i = 0; i < installed.length; i++) {
        var found = this.findMatch(installed[i], config, options.soft);
        if (found !== null) {
            result.install.splice(found, 1);
        } else {
            result.remove.push(installed[i]);
        }
    }
    
    return result;
};