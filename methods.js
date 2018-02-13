var fs = require('fs');
var cmd = require('child_process');

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
            version: match[2].replace("git+", "").replace("^", "").replace("~", "")
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
            version: match[2].replace("git+", "").replace("^", "").replace("~", "")
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
        plugins.push({name:match[1], version:match[2].replace("git+", "").replace("^", "").replace("~", "")});
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
        console.log("\n===> Installing " + plugin.name + " @ " + plugin.version);
        if (plugin.version.match("git+")) {
            try {
                cmd.execSync("cordova plugin add " + plugin.version + (options.fetch ? "" : " --nofetch ") + " --nosave", {
                    stdio: [0, 1, 2]
                });
            } catch (e) {
                // Do nothing, we do not want to stop if there was an error installing the plugin
            }
        } else {
            try {
                cmd.execSync("cordova plugin add " + plugin.name + "@" + plugin.version + " --nosave", {
                    stdio: [0, 1, 2]
                });
            } catch (e) {
                // Do nothing, we do not want to stop if there was an error installing the plugin
            }
        }
    }
};

exports.indexOfItem = function(set, item, noVersion) {
    for (var index in set) {
        if (set[index].name === item.name && (noVersion || set[index].version === item.version)) {
            return index;
        }
    }
    return -1;
};

exports.getPluginDifference = function(iset, set) {
    var toAdd = [];

    for (var item in set) {
        var properVersion = false;
        var index = this.indexOfItem(iset, set[item], true);
        
        if (index < 0) {
            toAdd.push(set[item]);
        }
        if (index >= 0 && (set[item].version.indexOf(".com/") || set[item].version.indexOf("file:"))) {
            properVersion = fs.readFileSync(process.cwd() + "/plugins/" + set[item].name + "/plugin.xml").indexOf(set[item].version);
            if (properVersion) {
                iset.splice(index, 1);
            } else {
                toAdd.push(set[item]);
            }
        }
    }

    return {
        toAdd: toAdd,
        toRemove: iset
    };
};

exports.getDifference = function(iset, set, soft) {
    var toAdd = [];

    for (var item in set) {
        var index = this.indexOfItem(iset, set[item], soft);
        if (index < 0) {
            toAdd.push(set[item]);
        } else {
            iset.splice(index, 1);
        }
    }

    return {
        toAdd: toAdd,
        toRemove: iset
    };
};