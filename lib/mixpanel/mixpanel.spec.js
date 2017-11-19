// /* Test for lib/mixpanel.js */

var assert = require('chai').assert;
var sinon = require('sinon');

var EventEmitter = require('events');
var eventbus = new EventEmitter;	// Temporary event bus to prevent events firing across files

var Mixpanel = require('.');

describe('Mixpanel client', function() {
	beforeEach(function() {
	    this.sinon = sandbox = sinon.sandbox.create();
	});
	describe('Initiation', function() {
		it('No token: Doesn\'t fail if no token is passed', function(done) {
			var _live = false;

			eventbus.once('mixpanel:init', function(live) {
				assert.equal(_live, live);
				done();
			});

			var mixpanel = Mixpanel.start({events: eventbus});
	 	});
		it('With Token: Initializes properly', function(done) {
			var _live = true;

			eventbus.once('mixpanel:init', function(live) {
				assert.equal(_live, live);
				done();
			});

			var mixpanel = Mixpanel.start({events: eventbus, token: 'blah', channel: '#harrypotterclan'});
		});
	})
	afterEach(function() {
	    sandbox.restore();
	});
})
