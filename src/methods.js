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

exports.findConfigPlugins = function(content) {
    var plugins = [];
    var packageFile = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    if (packageFile) {
        for (var item in packageFile.cordova.plugins) {
            if (packageFile.cordova.plugins.hasOwnProperty(item)) {
                var plugin = {
                    name: item,
                    version: packageFile.dependencies[item],
                    variables: packageFile[item]
                }

                console.log("FOUND " + plugin.name + " @ " + plugin.version);
                plugins.push(plugin);
            }
        }
    }

    return plugins;
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
    var packageFile = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    var platforms = [];
    for (var platform in packageFile.cordova.platforms) {
        var item = {
            name: packageFile.cordova.platforms[platform],
            version: packageFile.dependencies['cordova-' + packageFile.cordova.platforms[platform]]
        };
        console.log("FOUND " + item.name + " @ " + item.version);
        platforms.push(item);
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

exports.removePlatforms = function(platforms, options) {
    for (var index in platforms) {
        var platform = platforms[index];
        if (options.skipList.indexOf(platform.name.toLowerCase()) === -1) {
            console.log("\n===> Removing " + platform.name);
            try {
                cmd.execSync("cordova platform rm " + platform.name + " --nosave", {
                    stdio: [0, 1, 2]
                });
            } catch (e) {
                // Do nothing, we do not want to stop if there was an error removing a platform
            }
        } else {
            console.log("\n===> Skipping " + platform.name);
        }
        
    }
};

exports.installPlatforms = function(platforms, options) {
    for (var index in platforms) {
        var platform = platforms[index];
        if (options.skipList.indexOf(platform.name.toLowerCase()) === -1) {
            console.log("\n===> Installing " + platform.name + " @ " + platform.version);
            try {
                cmd.execSync("cordova platform add " + platform.name + "@" + platform.version + " --nosave", {
                    stdio: [0, 1, 2]
                });
            } catch (e) {
                // Do nothing, we do not want to stop if there was an error installing the platform
            }
        } else {
            console.log("\n===> Skipping " + platform.name);
        }
    }
};

exports.installPlugins = function(plugins, options) {
    for (var index in plugins) {
        var plugin = plugins[index];
        var pluginLine = "";
        console.log("\n===> Installing " + plugin.name + " @ " + plugin.version);

        var variables = "";
        if (plugin.variables) {
            for (var item in plugin.variables) {
                if (plugin.variables.hasOwnProperty(item)) {
                    variables += " --variable " + item + "=" + plugin.variables[item];
                }
            }
        }

        if (plugin.version.match("git+")) {
            pluginLine = plugin.version + variables + (options.fetch ? "" : " --nofetch");
        } else if (plugin.version.match("file:")) {
            pluginLine = plugin.version.replace("file:", "").replace('\\', '/') + variables + " --nofetch";
        } else {
            pluginLine = plugin.name + "@" + plugin.version + variables;
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

exports.findMatch = function(item, itemSet, options) {
    for (var i = 0; i < itemSet.length; i++) {
        if (itemSet[i].name === item.name &&
            ((options.soft || this.versionCheck(itemSet[i].version, item.version)) ||
            (!options.reLinks && (itemSet[i].version.match("git+") || itemSet[i].version.match("file:"))))) {
            return i;
        }
    }

    return null;
};

exports.versionCheck = function(criteria, version) {
    var result = false;

    switch (criteria[0]) {
        case '^':
            result = parseInt(criteria[1], 10) === parseInt(version[0], 10);
            break;
        case '~':
            result = parseInt(criteria[1], 10) === parseInt(version[0], 10);
            if (result) {
                result = parseInt(criteria[3], 10) === parseInt(version[2], 10);
            }
            break;
        default:
            result = criteria === version;
    }

    return result;
};

exports.getDifference = function(installed, config, options) {
    var result = { install:config, remove:[] };

    for (var i = 0; i < installed.length; i++) {
        var found = this.findMatch(installed[i], config, options);
        if (found === null) {
            result.remove.push(installed[i]);
        } else {
            result.install.splice(found, 1);
        }
    }
    
    return result;
};