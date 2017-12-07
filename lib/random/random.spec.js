// /* Test for lib/mixpanel.js */

var assert = require('chai').assert;
var sinon = require('sinon');

var EventEmitter = require('events');
var eventbus = new EventEmitter;	// Temporary event bus to prevent events firing across files

var Random = require('.');

describe('Random number generator', function() {
	beforeEach(function() {
	    this.sinon = sandbox = sinon.sandbox.create();

			Random.start();
	});
	describe('Random Integer', function() {
		it('Between 0 and 3', function() {
			var _min = 0;
			var _max = 3;

			var number = Random.between(0, 3);

			assert.isAtMost(number, _max);
			assert.isAtLeast(number, _min);
	 	});
	})
	afterEach(function() {
	    sandbox.restore();
	});
})
