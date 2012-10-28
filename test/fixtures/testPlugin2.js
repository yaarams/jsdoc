/*global sinon: true */
exports.handlers = {
    fileBegin: sinon.spy(),
    beforeParse: sinon.spy(),
    jsdocCommentFound: sinon.spy(),
    symbolFound: sinon.spy(),
    newDoclet: sinon.spy(),
    fileComplete: sinon.spy()
};

exports.nodeVisitor = sinon.stub({
    visitNode: function() {}
});