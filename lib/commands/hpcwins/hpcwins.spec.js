/* Test for hpcwins.js */

var assert = require('chai').assert;
var sinon = require('sinon');

var EventEmitter = require('events');
var eventbus = new EventEmitter;	// Temporary event bus to prevent events firing across files

var hpcwins;

describe('HPC Wins!', function() {
	beforeEach(function() {
	  this.sinon = sandbox = sinon.sandbox.create();

		var Hpcwins = require('.');
		hpcwins = Hpcwins.start(eventbus);
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
