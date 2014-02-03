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
                cb(err.message, null);
            }
            cb(null, data);
        });
    }

    function cmdGetFontList(cb) {
        figlet.fonts(function (err, fonts) {
            if (err) {
                cb(err.message, null);
            }
            cb(null, fonts);
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
            true // this command is asynchronous
        );
        
        DomainManager.registerCommand(
            "simple",
            "getFontList",
            cmdGetFontList,
            true
        );
    }

    exports.init = init;

}());