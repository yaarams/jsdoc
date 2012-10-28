/*global env: true, Reporter: true */

module.exports = (function() {
    var path = require('path'),
        fs = require('fs'),
        resolve = path.resolve,
        exists = fs.existsSync || path.existsSync,
        mochaExtend = require('test/mocha-extend'),
        Mocha = require('mocha'),
        utils = Mocha.utils,
        reporters = Mocha.reporters,
        interfaces = Mocha.interfaces,
        Base = reporters.Base,
        join = path.join,
        basename = path.basename,
        cwd = process.cwd();

    // If we need Sinon's timer/date functions, restore code from _mocha.js here

    // HACK: update a few Runner prototypes so they use eval() to duplicate functions;
    // otherwise we blow the call stack on Rhino
    // TODO: these help, but not enough...
    Mocha.Runner.prototype.runTests = function(suite, fn) {
        /*jshint evil: true */
        var self = this,
            tests = suite.tests,
            test;

        function next(err) {
            // if we bail after first err
            if (self.failures && suite._bail) {
                return fn();
            }

            // next test
            test = tests.shift();

            // all done
            if (!test) {
                return fn();
            }

            // grep
            var match = self._grep.test(test.fullTitle());
            if (self._invert) {
                match = !match;
            }
            if (!match) {
                return next();
            }

            // pending
            if (test.pending) {
                self.emit('pending', test);
                self.emit('test end', test);
                return next();
            }

            // execute test and hook(s)
            self.emit('test', self.test = test);
            self.hookDown('beforeEach', function() {
                self.currentRunnable = self.test;
                self.runTest(function(err) {
                    test = self.test;

                    if (err) {
                        self.fail(test, err);
                        self.emit('test end', test);
                        return self.hookUp( 'afterEach', eval(next) );
                    }

                    test.state = 'passed';
                    self.emit('pass', test);
                    self.emit('test end', test);
                    self.hookUp( 'afterEach', eval(next) );
                });
            });
        }

        this.next = next;
        next();
    };

    Mocha.Runner.prototype.runSuite = function(suite, fn) {
        /*jshint evil: true */
        var total = this.grepTotal(suite),
            self = this,
            i = 0;

        if (!total) {
            return fn();
        }

        this.emit('suite', this.suite = suite);

        function next() {
            var curr = suite.suites[i++];
            if (!curr) {
                return done();
            }
            self.runSuite(curr, eval(next));
        }

        function done() {
            self.suite = suite;
            self.hook('afterAll', function(){
                self.emit('suite end', suite);
                fn();
            });
        }

        this.hook('beforeAll', function(){
            self.runTests(suite, next);
        });
    };

    var mocha = new Mocha();

    /**
     * Files.
     */
    var files = [];

    // reporter
    var reporter = 'list';
    mocha.reporter(reporter);

    // interface
    var mochaInterface = 'bdd';
    mocha.ui(mochaInterface);

    // load reporter
    try {
        Reporter = require('mocha/lib/reporters/' + reporter);
    } catch (err) {
        try {
            Reporter = require(reporter);
        } catch (err) {
            throw new Error('reporter "' + reporter + '" does not exist');
        }
    }

    Base.useColors = env.opts.nocolor === true ? false : true;

    // allow new globals
    mocha.ignoreLeaks();

    /**
     * Lookup file names at the given `path`.
     */
    function lookupFiles(path, recursive) {
        var files = [];
        var re = new RegExp('\\.(js)$');

        if (!exists(path)) {
            path += '.js';
        }
        var stat = fs.statSync(path);
        if (stat.isFile()) {
            return path;
        }

        fs.readdirSync(path).forEach(function(file){
            file = join(path, file);
            var stat = fs.statSync(file);
            if (stat.isDirectory()) {
                if (recursive) {
                    files = files.concat(lookupFiles(file, recursive));
                }
                return;
            }
            if (!stat.isFile() || !re.test(file) || basename(file)[0] == '.') {
                return;
            }
            files.push(file);
        });

        return files;
    }

    /**
     * Play the given array of strings.
     */

    function play(arr, interval) {
        var len = arr.length,
            i = 0;
        interval = interval || 100;

        play.timer = setInterval(function(){
            var str = arr[i++ % len];
            process.stdout.write('\r' + str);
        }, interval);
    }

    // default files to test/*.{js}
    files = files.concat(lookupFiles( join('test', 'specs'), true) );

    // resolve
    files = files.map(function(path){
        return resolve(path);
    });

    // add support for Jasmine-style matchers, and make sinon global
    mochaExtend.extend(mocha.suite);

    // load; work around a Rhino issue with Mocha.prototype.loadFiles
    mocha.files = files;
    files.forEach(function(file) {
        mocha.suite.emit('pre-require', global, file, mocha);
        mocha.suite.emit('post-require', global, file, mocha);
    });

    // now we're ready!
    mocha.run(process.exit);

    /**
     * Parse list.
     */
    function list(str) {
        return str.split(/ *, */);
    }

    /**
     * Hide the cursor.
     */
    function hideCursor(){
        process.stdout.write('\u001b[?25l');
    }

    /**
     * Show the cursor.
     */
    function showCursor(){
        process.stdout.write('\u001b[?25h');
    }

    /**
     * Stop play()ing.
     */
    function stop() {
        process.stdout.write('\u001b[2K');
        clearInterval(play.timer);
    }
})();
