/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4,
maxerr: 50, browser: true */
/*global $, define, brackets */

define(function (require, exports, module) {
    "use strict";

    var AppInit        = brackets.getModule("utils/AppInit"),
        ProjectManager = brackets.getModule("project/ProjectManager"),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
//        figlet = require("./node/node_modules/figlet/lib/figlet"),
        NodeConnection = brackets.getModule("utils/NodeConnection");

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
                console.error("[brackets-simple-node] failed to connect to node");
            });
            return connectionPromise;
        }
        
        function loadSimpleDomain() {
            var path = ExtensionUtils.getModulePath(module, "node/SimpleDomain");
            var loadPromise = nodeConnection.loadDomains([path], true);
            loadPromise.fail(function () {
                console.log("[brackets-simple-node] failed to load domain");
            });
            return loadPromise;
        }
        
        function logMemory() {
            var memoryPromise = nodeConnection.domains.simple.getMemory();
            memoryPromise.fail(function (err) {
                console.error("[brackets-simple-node] failed to run simple.getMemory", err);
            });
            memoryPromise.done(function (memory) {
                console.log(
                    "[brackets-simple-node] Memory: %d of %d bytes free (%d%)",
                    memory.free,
                    memory.total,
                    Math.floor(memory.free * 100 / memory.total)
                );
            });
            return memoryPromise;
        }
        
        function convertText() {
            var textPromise = nodeConnection.domains.simple.convertText();
            textPromise.fail(function (err) {
                console.error("[brackets-simple-node] failed to get text", err);
            });
            textPromise.done(function (text) {
                console.log(
                    "kjkj"//text.output
                );
            });
            return textPromise;
        }

        chain(connect, loadSimpleDomain, logMemory, convertText);
        
    });

});