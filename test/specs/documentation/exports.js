/*global describe: true, expect: true, it: true */
var helpers = require('test/specs/helpers');

describe("'exports' symbol in modules", function() {
    var docSet = helpers.getDocSetFromFile('test/fixtures/exports.js'),
        helloworld = docSet.getByLongname('module:hello/world')[0],
        sayhello = docSet.getByLongname('module:hello/world.sayHello')[0];

    it('When a symbol starts with the special name "exports" and is in a file with a @module tag, the symbol is documented as a member of that module.', function() {
        expect(typeof sayhello).toEqual('object');
        expect(sayhello.kind).toEqual('function');
        expect(sayhello.memberof).toEqual('module:hello/world');
    });
});