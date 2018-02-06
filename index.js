#!/usr/bin/env node

var fs = require('fs');
var cmd = require('child_process');
var noForce = (process.argv.indexOf("--noforce") >= 0 || process.argv.indexOf("--nf") >= 0);
var noRemove = (process.argv.indexOf("--noremove") >= 0 || process.argv.indexOf("--nr") >= 0);
var fetch = (process.argv.indexOf("--gitfetch") >= 0 || process.argv.indexOf("--gf") >= 0);
var noAdd = (process.argv.indexOf("--noadd") >= 0 || process.argv.indexOf("--na") >= 0);
var content;

console.log("\n================<Cleaning Cordova Plugins>================");

if (noForce || noRemove || fetch || noAdd) {
    console.log("\n===> Arguments Found:" + (noRemove ? " <NO REMOVE>" : "") + (noForce ? " <NO FORCE>" : "") + (fetch ? " <GIT FETCH>" : "") + (noAdd ? " <NO ADD>" : ""));
}

if (!fs.existsSync(process.cwd() + "/config.xml")) {
    console.error("\n==> ERROR: No config.xml found!");
    console.log("\n==========================<Done>==========================\n");
    return;
}

try {
    content = fs.readFileSync(process.cwd() + "/config.xml");
} catch (e) {
    // Do nothing, this will be handled by logic below
}

if (!fs.existsSync(process.cwd() + "/config.xml")) {
    console.error("\n==> ERROR: Problem reading config.xml!");
    console.log("\n==========================<Done>==========================\n");
    return;
}

if (noRemove) {
    console.log("\n=====================<Skipped Remove>=====================");
} else {
    console.log("\n================<Finding Installed Plugins>===============");
    var foundItems = fs.readdirSync(process.cwd() + "/plugins/");
    var iplugins = [];
    for (var index in foundItems) {
        if (fs.lstatSync(process.cwd() + "/plugins/" + foundItems[index]).isDirectory()) {
            console.log("FOUND " + foundItems[index]);
            iplugins.push(foundItems[index]);
        }
    }

    console.log("\n===============<Removing Installed Plugins>===============");
    for (var index in iplugins) {
        console.log("\n===> Removing " + iplugins[index]);
        try {
            cmd.execSync("cordova plugin rm " + iplugins[index] + " --nosave" + (noForce ? "" : " --force"), {
                stdio: [0, 1, 2]
            });
        } catch (e) {
            // Do nothing, we do not want to stop if there was an error removing a plugin
        }
    }
}

if (noAdd) {
    console.log("\n======================<Skipped Add>=======================");
} else {
    console.log("\n=================<Finding Config Plugins>=================");
    var pattern = /<plugin[ ]+name=\"(.+)\"[ ]+spec=\"(.+)\"/gi;
    var match = pattern.exec(content);
    var plugins = {};
    while (match !== null) {
        console.log("FOUND " + match[1] + " @ " + match[2]);
        plugins[match[1]] = match[2].replace("git+", ""); //.replace("^", "").replace("~", "");
        match = pattern.exec(content);
    }
    
    console.log("\n==============<Installing Config.xml Plugins>=============");
    for (var plugin in plugins) {
        console.log("\n===> Installing " + plugin + " @ " + plugins[plugin]);
        if (plugins[plugin].match("git+")) {
            try {
                cmd.execSync("cordova plugin add " + plugins[plugin] + (fetch ? "" : " --nofetch ") + " --nosave", {
                    stdio: [0, 1, 2]
                });
            } catch (e) {
                // Do nothing, we do not want to stop if there was an error installing the plugin
            }
        } else {
            try {
                cmd.execSync("cordova plugin add " + plugin + "@" + plugins[plugin] + " --nosave", {
                    stdio: [0, 1, 2]
                });
            } catch (e) {
                // Do nothing, we do not want to stop if there was an error installing the plugin
            }
        }
    }
}

console.log("\n==========================<Done>==========================\n");