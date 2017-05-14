/* Test for house.js */

var assert = require('chai').assert;
var sinon = require('sinon');

var EventEmitter = require('events');
var eventbus = new EventEmitter;	// Temporary event bus to prevent events firing across files

var powermove;

describe('Power Move!', function() {
	beforeEach(function() {
	    this.sinon = sandbox = sinon.sandbox.create();

		var Powermove = require('.');
		powermove = Powermove.start(eventbus);
	});
	describe('Trigger Powermove overlay', function() {
		it('Sends a valid event to overlay server', function(done) {
			var _payload = {
				powermove_video: 'powermove/video/powermove.mp4',
				delay: 8000
			};

			eventbus.once('stream:powermove', function(payload) {

				assert.deepEqual(payload, _payload);

				done();
			});

			eventbus.emit('powermove:start');
		});
	});
	afterEach(function() {
	    sandbox.restore();
	});
});
