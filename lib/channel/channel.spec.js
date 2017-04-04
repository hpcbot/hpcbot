/* Test for lib/channel.js */

var assert = require('chai').assert;
var eventbus = require('../eventbus');
var strings = require('../../config/strings.json');

var db = require('../db');
db.connect('mode_staging');	// Do not remove this or you will wipe your data

var Channel = require('.');
var channel = Channel.start(db);

describe('Channel', function() {
	it('Throws an error if no db is passed in', function() {
		var _err = "Database not found";
		try {
			Channel.start();
		} 
		catch (err) {
			assert.equal(err, _err);
		}
	});

	beforeEach(function(done) {
		// Wipe database before running tests. Note: Make _SURE_ you are on staging
		db.get().flushdb(function(err) {
			if(!err) {
				done();
			}
		});
	});
	describe('setCommends', function() {
		it('sets a mod\'s commends', function(done) {
			var username = 'bdickason';
			var commends = 53;

			var _err = null;
			var _username = 'bdickason';
			var _commends = '53';

			eventbus.once('whisper:commendsset', function(err, username, amount) {
				assert.equal(_err, err);
				assert.equal(_username, username);
				assert.equal(_commends, commends);
				done();
			});
			db.get().hset('user:' + username, 'uid', 0, function(err, data) {
				if(!err) {
					eventbus.emit('channel:setcommends', username, commends);
				}
			})
		});
		// Ignores the command from a non-mod
	});
});