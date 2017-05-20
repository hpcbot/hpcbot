/* Test for Hpcwins.js */

var assert = require('chai').assert;
var sinon = require('sinon');

var EventEmitter = require('events');
var eventbus = new EventEmitter;	// Temporary event bus to prevent events firing across files

var Hpcwins;

describe('HPC Wins!', function() {
	beforeEach(function() {
	  this.sinon = sandbox = sinon.sandbox.create();

		Hpcwins = require('.');
		Hpcwins.start(eventbus);
	});
	describe('Chat Triggers', function() {
		it('Contains settings for !hpcwins', function() {
			assert.notEqual(Hpcwins.triggers, null);
			assert.equal(Hpcwins.triggers[0].name, 'hpcwins');
			assert.equal(Hpcwins.triggers[0].type, 'whisper');
			assert.equal(Hpcwins.triggers[0].whitelist, true);
			assert.equal(Hpcwins.triggers[0].event, 'hpcwins:start');
		});
	});

	describe('Trigger hpcwins overlay', function() {
		it('Sends a valid event to overlay server', function(done) {
			var _payload = {
				hpcwins_video: 'hpcwins/video/hpcwins.mp4',
				delay: 10000
			};

			eventbus.once('stream:hpcwins', function(payload) {

				assert.deepEqual(payload, _payload);

				done();
			});

			eventbus.emit('hpcwins:start');
		});
	});
	afterEach(function() {
	    sandbox.restore();
	});
});
