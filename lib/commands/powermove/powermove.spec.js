/* Test for Powermove.js */

var assert = require('chai').assert;
var sinon = require('sinon');

var EventEmitter = require('events');
var eventbus = new EventEmitter;	// Temporary event bus to prevent events firing across files

var Powermove;

describe('Power Move!', function() {
	beforeEach(function() {
	    this.sinon = sandbox = sinon.sandbox.create();

		Powermove = require('.');
		Powermove.start(eventbus);
	});
	describe('Chat Triggers', function() {
		it('Contains settings for !powermove', function() {
			assert.notEqual(Powermove.triggers, null);
			assert.equal(Powermove.triggers[0].name, 'powermove');
			assert.equal(Powermove.triggers[0].type, 'whisper');
			assert.equal(Powermove.triggers[0].whitelist, true);
			assert.equal(Powermove.triggers[0].event, 'powermove:start');
		});
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
