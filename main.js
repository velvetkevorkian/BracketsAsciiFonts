/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4,
maxerr: 50, browser: true */
/*global $, define, brackets */

define(function (require, exports, module) {
    "use strict";

    var AppInit        = brackets.getModule("utils/AppInit"),
        ProjectManager = brackets.getModule("project/ProjectManager"),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        NodeConnection = brackets.getModule("utils/NodeConnection"),
        font = "graffiti",
        input = "Faster Disco";

    function chain() {
        var functions = Array.prototype.slice.call(arguments, 0);
        if (functions.length > 0) {
            var firstFunction = functions.shift();
            var firstPromise = firstFunction.call();
            firstPromise.done(function () {
                chain.apply(null, functions);
            });
        }
    }

    
    AppInit.appReady(function () {
        var nodeConnection = new NodeConnection();
        
        function connect() {
            var connectionPromise = nodeConnection.connect(true);
            connectionPromise.fail(function () {
                console.error("[ASCII Art] failed to connect to node");
            });
            return connectionPromise;
        }
        
        function loadSimpleDomain() {
            var path = ExtensionUtils.getModulePath(module, "node/SimpleDomain");
            var loadPromise = nodeConnection.loadDomains([path], true);
            loadPromise.fail(function () {
                console.log("[ASCII Art] failed to load domain");
            });
            return loadPromise;
        }
        
        function getFontList() {
            var fontsPromise = nodeConnection.domains.simple.getFontList();
            fontsPromise.fail(function (err) {
                console.error("[ASCII Art] failed to get font list", err);
            });
            fontsPromise.done(function (fontList) {
                console.dir(fontList);
            });
            return fontsPromise;
        }
                        
        
        
        function convertText() {
            //r input = "Hello bitches";
            var textPromise = nodeConnection.domains.simple.convertText(input, font);
            textPromise.fail(function (err) {
                console.error("[ASCII Art] failed to get text", err);
            });
            textPromise.done(function (text) {
                console.log(
                    text
                );
            });
            return textPromise;
        }

        chain(connect, loadSimpleDomain, getFontList, convertText);
        
    });

});