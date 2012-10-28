/*jshint evil: true */
function fakeRequire(path) {
    var module = {}, exports = {};
    eval( readFile(__dirname + '/' + path + '.js') );
    if (Object.keys(module).length > 0 && module.exports) {
        return module.exports;
    } else {
        return exports;
    }
}