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
	it('Subscription: Triggers an overlay when a user subscribes', function(done) {
		var username = 'bdickason';
		eventbus.once('subscription:show', function(username) {
			assert.equal(username, 'bdickason');
			done();
		});

		eventbus.emit('user:subscribe', username);
	});

});
