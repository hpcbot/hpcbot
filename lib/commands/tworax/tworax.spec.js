/* Test for house.js */

var assert = require('chai').assert;
var sinon = require('sinon');

var EventEmitter = require('events');
var eventbus = new EventEmitter;	// Temporary event bus to prevent events firing across files

var TwoRax;

describe('twoRax and Bax!', function() {
	beforeEach(function() {
	    this.sinon = sandbox = sinon.sandbox.create();

		TwoRax = require('.');
		TwoRax.start(eventbus);
	});
	describe('Chat Triggers', function() {
		it('Contains settings for !2rnb', function() {
			assert.notEqual(TwoRax.triggers, null);
			assert.equal(TwoRax.triggers[0].name, '2rnb');
			assert.equal(TwoRax.triggers[0].type, 'whisper');
			assert.equal(TwoRax.triggers[0].whitelist, true);
			assert.equal(TwoRax.triggers[0].event, 'tworax:show');
		});
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

			eventbus.emit('tworax:show');
		});
	});
	afterEach(function() {
	    sandbox.restore();
	});
});
