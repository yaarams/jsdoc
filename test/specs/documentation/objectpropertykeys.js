/*global describe: true, expect: true, it: true */
var helpers = require('test/specs/helpers');

describe("using existing Object properties as object literal keys", function() {
    var docSet = helpers.getDocSetFromFile('test/fixtures/objectpropertykeys.js');
    it("should not crash", function() {
        expect(true).toBeTruthy();
    });
});