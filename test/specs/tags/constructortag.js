/*global describe: true, expect: true, it: true */
var helpers = require('test/specs/helpers');

describe("@constructor tag", function() {
    var docSet = helpers.getDocSetFromFile('test/fixtures/constructortag.js'),
        feed = docSet.getByLongname('Feed')[0];

    it('When a symbol has an @constructor tag, it is documented as a class.', function() {
        expect(feed.kind).toEqual('class');
    });

    it('When a symbol has an @constructor tag and a @class tag, the value of the @class tag becomes the classdesc property.', function() {
        expect(feed.classdesc).toEqual('Describe your class here.');
        expect(feed.description).toEqual('Describe your constructor function here.');
    });
});