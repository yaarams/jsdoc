/*global sinon: true */
exports.handlers = {
    fileBegin: sinon.spy(),
    beforeParse: sinon.spy(),
    jsdocCommentFound: sinon.spy(),
    symbolFound: sinon.spy(),
    newDoclet: sinon.spy(),
    fileComplete: sinon.spy()
};

exports.defineTags = function(dictionary) {
    dictionary.defineTag("foo", {
        canHaveName: true,
        onTagged: function(doclet, tag) {
            doclet.foo = true;
        }
    });
};

exports.nodeVisitor = sinon.stub({
    visitNode: function(node, e, parser, currentSourceName) {
        e.stopPropagation = true;
    }
});