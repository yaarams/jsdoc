/*global describe: true, expect: true, it: true */
var helpers = require('test/specs/helpers');

describe("@author tag", function() {
    var docSet = helpers.getDocSetFromFile('test/fixtures/authortag.js'),
        Thingy = docSet.getByLongname('Thingy')[0];

    it('When a symbol has a @author tag, the doclet has a author property with that value.', function() {
        expect(Thingy.author[0]).toEqual('Michael Mathews <micmath@gmail.com>');
    });
});