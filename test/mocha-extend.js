var fs = require('fs');
var path = require('path');

function addExpect(context, file, mocha) {
	context.expect = require('expect.js');
}

function addMatchers(context, file, mocha) {
	var assertion = context.expect.Assertion;
	var item;

	// Add prototypes that have a 1:1 mapping between Jasmine and expect.js
	var protoMap = [
		['toBe', 'be'],
		['toEqual', 'eql'],
		['toMatch', 'match'],
		['toBeTruthy', 'ok'],
		['toContain', 'contain'],
		['toBeLessThan', 'lessThan'],
		['toBeGreaterThan', 'greaterThan'],
		['toThrow', 'throwError']
	];
	protoMap.forEach(function(proto) {
		assertion.prototype[proto[0]] = assertion.prototype[proto[1]];
	});

	// Add prototypes that don't have a 1:1 mapping
	assertion.prototype.toBeDefined = function() {
		return !this.be(undefined);
	};

	assertion.prototype.toBeUndefined = function() {
		return this.be(undefined);
	};

	assertion.prototype.toBeNull = function() {
		return this.be(null);
	};

	assertion.prototype.toBeFalsy = function() {
		return !this.ok();
	};

	assertion.prototype.toBeCloseTo = function(expected, precision) {
		var i = require('util').inspect;

		if (precision !== 0) {
			precision = precision || 2;
		}

		this.assert(
			Math.abs(expected - this.obj) < (Math.pow(10, -precision) / 2),
			function() {
				return 'expected ' + i(this.obj) + ' to be within ' + precision + ' of ' + expected;
			},
			function() {
				return 'expected ' + i(this.obj) + ' not to be within ' + precision + ' of ' +
					expected;
			}
		);

		return Math.abs(expected - this.actual) < (Math.pow(10, -precision) / 2);
	};
}

function addSinon(context, file, mocha) {
	context.sinon = require('test/sinon-jsdoc');
}

exports.extend = function(mochaSuite) {
	mochaSuite.on('pre-require', addExpect);
	mochaSuite.on('pre-require', addMatchers);
	mochaSuite.on('pre-require', addSinon);
};
