/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4,
maxerr: 50, node: true */
/*global $*/

(function () {
    "use strict";

    var os = require("os");
    var figlet = require("./node_modules/figlet/lib/node-figlet");

    function cmdConvertText(input, font, cb) {
        figlet.text(input, {
            font: font,
            horizontalLayout: 'default',
            verticalLayout: 'default'
        }, function (err, data) {
            if (err) {
                //console.log('Something went wrong...');
                //console.dir(err);
                //return "uh oh";
                cb(err.message, null);
            }
            console.log("\n" + data);
            cb(null, data);
        });
    }
    
    function init(DomainManager) {
        if (!DomainManager.hasDomain("simple")) {
            DomainManager.registerDomain("simple", {
                major: 0,
                minor: 1
            });
        }
       
        DomainManager.registerCommand(
            "simple", // domain name
            "convertText", // command name
            cmdConvertText, // command handler function
            true, // this command is asynchronous
            "prints the word victory to the node console", [], // no parameters
            [{
                name: "convertText",
                type: "{string}",
                description: " "
            }]
        );
    }

    exports.init = init;

}());