/* Test for join.js */

var assert = require('chai').assert;
var sinon = require('sinon');

var strings = require('../../../config/strings.json');

var EventEmitter = require('events');
var eventbus = new EventEmitter;	// Temporary event bus to prevent events firing across files

var subscribe;

describe('Subscribe', function() {
	beforeEach(function() {
		var Subscribe = require('.');
		subscribe = Subscribe.start(eventbus);
	});
	it('Subscription: Triggers a text overlay when a user subscribes', function(done) {
		var username = 'bdickason';
		var _botname = 'hpc_dumbledore';
		eventbus.once('stream:text', function(botname, output) {
			assert.equal(_botname, botname);
			assert.include(output, 'bdickason');
			assert.include(output, strings.subscribe.has_subscribed);
			done();
		});

		eventbus.emit('user:subscribe', username);
	});

});
