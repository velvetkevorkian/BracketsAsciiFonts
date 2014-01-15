/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4,
maxerr: 50, browser: true */
/*global $, define, brackets */

define(function (require, exports, module) {
    "use strict";

    var AppInit = brackets.getModule("utils/AppInit"),
        //ProjectManager = brackets.getModule("project/ProjectManager"),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        NodeConnection = brackets.getModule("utils/NodeConnection"),
        CommandManager = brackets.getModule("command/CommandManager"),
        EditorManager = brackets.getModule("editor/EditorManager"),
        Menus = brackets.getModule("command/Menus"),
        PanelManager = brackets.getModule("view/PanelManager"),
        FIGLET_CMD_ID = "fig.convert",
        font = "graffiti",
        //input,
        nodeConnection;
    
    var ui = $('<div><h1>Figlet</h1><select id="fontSelect"></select></div>');

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
    
    
    

    function getFontList() {
        var fontsPromise = nodeConnection.domains.simple.getFontList();
        fontsPromise.fail(function (err) {
            console.error("[ASCII Art] failed to get font list", err);
        });
        fontsPromise.done(function (fontList) {
//            console.dir(fontList);
            for (var i = 0; i<fontList.length; i++){
                $('#fontSelect').append($('<option value=' + fontList[i] + '>' + fontList[i] + '</option>'));
            }   
            
        });
        return fontsPromise;
    }

    

    function convertText() {
        var editor = EditorManager.getCurrentFullEditor();
        var input = editor.getSelectedText();
        var start, end, cursorPosition;
        cursorPosition = editor.getCursorPos();
        start = {
            line: cursorPosition.line,
            ch: cursorPosition.ch - input.length
        };
        console.log(start);
        
        if (input.length > 0) {
            var textPromise = nodeConnection.domains.simple.convertText(input, font);
            textPromise.fail(function (err) {
                console.error("[ASCII Art] failed to get text", err);
            });
            textPromise.done(function (text) {
                console.log(text);
                editor.document.replaceRange("\n" + text + "\n", start, cursorPosition);
            });
            return textPromise;
        } else {
            alert("No text selected.");
        }
    }


    AppInit.appReady(function () {
        nodeConnection = new NodeConnection();

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

        chain(connect, loadSimpleDomain);

        var editMenu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);

        CommandManager.register("Convert to ASCII Art", FIGLET_CMD_ID, figletUI);
        editMenu.addMenuItem(FIGLET_CMD_ID);

    });
    
    function figletUI() {
        var figletUIPanel = PanelManager.createBottomPanel("figletUI", ui, 200);
        getFontList();
        figletUIPanel.show();
        
    }



});