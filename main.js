/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4,
maxerr: 50, browser: true */
/*global $, define, brackets */

define(function (require, exports, module) {
    "use strict";

    var AppInit = brackets.getModule("utils/AppInit"),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        NodeConnection = brackets.getModule("utils/NodeConnection"),
        CommandManager = brackets.getModule("command/CommandManager"),
        EditorManager = brackets.getModule("editor/EditorManager"),
        Menus = brackets.getModule("command/Menus"),
        PanelManager = brackets.getModule("view/PanelManager"),
        ASCIIART_CMD_ID = "asciiArt.convert",
        font,
        output,
        nodeConnection,
        asciiArtPanel;

    var ui = $('<div id="asciiArtPanel" class="bottom-panel"><div class="toolbar simple-toolbar-layout mainToolbar"><span>Convert to ASCII Art</span><a href="#" id="close" class="close">&times;</a></div><div style="padding: 15px;"><label for="fontSelect">Select font:</label><select name="fontSelect" id="fontSelect"></select> <button id="preview" class="btn" style="margin: 0 0 9px;">Preview</button> <button id="go" class="btn" style="margin: 0 0 9px;">Go</button><label>Preview:</label><p id="asciiArtPreview"><pre id="asciiArtPreviewCode">Highlight some text, choose a font and press go! Use preview to, er, preview.</pre></p></div></div>');

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



    function noSelectionError() {
        $("#asciiArtPreviewCode").html('No text selected!');
    }


    function getFontList() {
        var fontsPromise = nodeConnection.domains.simple.getFontList();
        var i = 0;
        fontsPromise.fail(function (err) {
            console.error("[ASCII Art] failed to get font list", err);
        });
        fontsPromise.done(function (fontList) {
            for (i = 0; i < fontList.length; i++) {
                $('#fontSelect').append($('<option value="' + fontList[i] + '">' + fontList[i] + '</option>'));
            }

        });
        return fontsPromise;
    }



    function convertText(preview) {
        var editor = EditorManager.getCurrentFullEditor();
        var input = editor.getSelectedText();
        var start, end, cursorPosition;
        cursorPosition = editor.getCursorPos();
        start = {
            line: cursorPosition.line,
            ch: cursorPosition.ch - input.length
        };

        if (input.length > 0) {
            var textPromise = nodeConnection.domains.simple.convertText(input, font);
            textPromise.fail(function (err) {
                console.error("[ASCII Art] failed to get text", err);
            });
            textPromise.done(function (text) {
                output = text;
                if (preview) {
                    $("#asciiArtPreviewCode").html('<br>' + output + '<br>');
                } else {
                    editor.document.replaceRange("\n" + text + "\n", start, cursorPosition);
                }
            });
            return textPromise;
        } else {
            noSelectionError();
        }
    }



    function asciiArtUI() {
        getFontList();
        asciiArtPanel.show();

    }
    
    function bindEvents() {
        $("#asciiArtPanel #fontSelect").change(function () {
            font = $(this).find(":selected").text();
            convertText(true); //preview true
        });
        $("#asciiArtPanel #preview").click(function () {
            convertText(true);
        });
        $("#asciiArtPanel #go").click(function () {
            convertText(false); //preview false
            console.log('hello!');
        });
        
        $("#asciiArtPanel #close").click(function () {
            $("#asciiArtPanel").css("display", "none");
            EditorManager.resizeEditor();
            $("#asciiArtPanel .vert-resizer").remove();
        });
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
        asciiArtPanel = PanelManager.createBottomPanel("asciiArtPanel", ui, 400);
        bindEvents();
        var editMenu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);
        

        CommandManager.register("Convert to ASCII Art", ASCIIART_CMD_ID, asciiArtUI);
        editMenu.addMenuItem(ASCIIART_CMD_ID);
        
       
        

    });




});