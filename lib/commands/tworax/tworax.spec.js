/* Test for house.js */

var assert = require('chai').assert;
var sinon = require('sinon');

var EventEmitter = require('events');
var eventbus = new EventEmitter;	// Temporary event bus to prevent events firing across files

var twoRax;

describe('twoRax and Bax!', function() {
	beforeEach(function() {
	    this.sinon = sandbox = sinon.sandbox.create();

		var TwoRax = require('.');
		twoRax = TwoRax.start(eventbus);
	});

	describe('Trigger twoRax overlay', function() {
		it('Sends a valid event to overlay server', function(done) {
			var _payload = {
				tworax_video: 'tworax/video/tworax.mp4',
				delay: 14000
			};

			eventbus.once('stream:tworax', function(payload) {

				assert.deepEqual(payload, _payload);

				done();
			});

			eventbus.emit('tworax:start');
		});
	});
	afterEach(function() {
	    sandbox.restore();
	});
});
