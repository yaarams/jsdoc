/*global describe: true, expect: true, it: true */
var helpers = require('test/specs/helpers');

describe("@kind tag with type", function() {
    var docSet = helpers.getDocSetFromFile('test/fixtures/typekind.js'),
        blog = docSet.getByLongname('module:blog/server')[0],
        port = docSet.getByLongname('module:blog/server.port')[0];

    it('When a module symbol has an kind tag, that includes a {type} clause, the doclet has a type property set to that {type} clause', function() {
        expect(typeof blog.type).toEqual('object');
        expect(blog.type.names.join(', ')).toEqual('ConnectServer');
    });

    it('When a property symbol has an kind tag, that includes a {type} clause, the doclet has a type property set to that {type} clause', function() {
        expect(typeof port.type).toEqual('object');
        expect(port.type.names.join(', ')).toEqual('number');
    });
});