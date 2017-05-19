/* Test for gift.js */

var assert = require('chai').assert;
var sinon = require('sinon');

var EventEmitter = require('events');
var eventbus = new EventEmitter;	// Temporary event bus to prevent events firing across files

var gift;

describe('gift!', function() {
	beforeEach(function() {
	  this.sinon = sandbox = sinon.sandbox.create();

		var gift = require('.');
		gift = gift.start(eventbus);
	});

	describe('Trigger gift overlay', function() {
		it('Sends a valid event to overlay server', function(done) {
			var _payload = {
				gift_video: 'gift/video/gift.mp4',
				delay: 23000
			};

			eventbus.once('stream:gift', function(payload) {

				assert.deepEqual(payload, _payload);

				done();
			});

			eventbus.emit('gift:start');
		});
	});
	afterEach(function() {
	    sandbox.restore();
	});
});
