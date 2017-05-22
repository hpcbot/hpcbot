/* Test for lib/channel.js */

var assert = require('chai').assert;
var sinon = require('sinon');

var EventEmitter = require('events');
var eventbus = new EventEmitter;	// Temporary event bus to prevent events firing across files

var db = require('../../db');
db.connect('mode_staging');	// Do not remove this or you will wipe your data

// Pass in dummy token for testing
var Mixpanel = require('mixpanel');
var mixpanel = Mixpanel.init('test');

var Channel = require('.');
Channel.start(db, eventbus);

describe('Channel', function() {
	beforeEach(function(done) {
		// Wipe database before running tests. Note: Make _SURE_ you are on staging
		db.get().flushdb(function(err) {
			if(!err) {
				done();
			}
		});
	});
});
