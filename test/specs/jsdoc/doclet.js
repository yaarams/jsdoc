/*global describe: true, env: true, expect: true, it: true, jasmine: true */
var helpers = require('test/specs/helpers');

describe("jsdoc/doclet", function() {
    // TODO: more tests
    
    var docSet = helpers.getDocSetFromFile('test/fixtures/doclet.js'),
        test1 = docSet.getByLongname('test1')[0],
        test2 = docSet.getByLongname('test2')[0];

    var expectStrong = "**Strong** is strong";
    var expectList = "* List item 1";

    it('does not mangle Markdown in a description that uses leading asterisks', function() {
        expect(test2.description.indexOf(expectStrong)).toBeGreaterThan(-1);
        expect(test2.description.indexOf(expectList)).toBeGreaterThan(-1);
    });
});
