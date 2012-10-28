/*global app: true, describe: true, expect: true, installPlugins: true, it: true */
var helpers = require('test/specs/helpers');

describe("plugins", function() {
    installPlugins(['test/fixtures/testPlugin1', 'test/fixtures/testPlugin2']);

    var plugin1 = require('test/fixtures/testPlugin1'),
        plugin2 = require('test/fixtures/testPlugin2'),
        docSet;

    docSet = helpers.getDocSetFromFile("test/fixtures/plugins.js", app.jsdoc.parser);

    it("should fire the plugin's event handlers", function() {
        expect(plugin1.handlers.fileBegin.called).toBe(true);
        expect(plugin1.handlers.beforeParse.called).toBe(true);
        expect(plugin1.handlers.jsdocCommentFound.called).toBe(true);
        expect(plugin1.handlers.symbolFound.called).toBe(true);
        expect(plugin1.handlers.newDoclet.called).toBe(true);
        expect(plugin1.handlers.fileComplete.called).toBe(true);

        expect(plugin2.handlers.fileBegin.called).toBe(true);
        expect(plugin2.handlers.beforeParse.called).toBe(true);
        expect(plugin2.handlers.jsdocCommentFound.called).toBe(true);
        expect(plugin2.handlers.symbolFound.called).toBe(true);
        expect(plugin2.handlers.newDoclet.called).toBe(true);
        expect(plugin2.handlers.fileComplete.called).toBe(true);
    });

    it("should add the plugin's tag definitions to the dictionary", function() {
        var test = docSet.getByLongname("test");

        expect(test[0].longname).toEqual("test");
        expect(test[0].foo).toEqual(true);
    });

    it("should call the plugin's visitNode function", function() {
        expect(plugin1.nodeVisitor.visitNode.called).toBe(true);
    });

    it("should not call a second plugin's visitNode function if the first stopped propagation", function() {
        expect(plugin2.nodeVisitor.visitNode.called).toBe(false);
    });
});