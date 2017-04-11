/* Test for lib/user.js */

var assert = require('chai').assert;
var strings = require('../../../config/strings.json');

var EventEmitter = require('events');
var eventbus = new EventEmitter;	// Temporary event bus to prevent events firing across files

var db = require('../../db');
db.connect('mode_staging');	// Do not remove this or you will wipe your data

var User = require('.');
var user = User.start(eventbus, db);

describe('Users', function() {
	beforeEach(function(done) {
		// Wipe database before running tests. Note: Make _SURE_ you are on staging
		db.get().flushdb(function(err) {
			if(!err) {
				done();
			}
		});
	});
});
