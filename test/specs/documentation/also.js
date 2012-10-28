/*global describe: true, expect: true, it: true */
var helpers = require('test/specs/helpers');

describe("multiple doclets per symbol", function() {
    var docSet = helpers.getDocSetFromFile('test/fixtures/also.js'),
        name = docSet.getByLongname('Asset#name').filter(function($) {
            return ! $.undocumented;
        });

    it('When a symbol has two doclets adjacent to each other both doclets apply to the symbol.', function() {
        expect(name.length).toEqual(2);
    });
});