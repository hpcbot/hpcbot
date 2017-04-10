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

	// describe('setCommends', function() {
	// 	it('No Parameters: Ignores', function(done) {
	// 		var username = 'bdickason';
	// 		var commends = null;
	// 		var uid = 0;

	// 		var _err = 'Error setting commends';
	// 		var _username = 'bdickason';
	// 		var _commends = null;
	// 		var _uid = 0;


	// 		eventbus.once('whisper:commendsset', function(err, username, amount) {
	// 			// Make sure event is being triggered properly
	// 			assert.equal(_err, err);
	// 			assert.equal(_username, username);
	// 			assert.equal(_commends, commends);
	// 			db.get().hgetall('user:' + username, function(err, data) {
	// 				// Make sure data is notstored in db
	// 				assert.equal(_uid, data.uid);
	// 				assert.equal(_commends, data.commends);
	// 				done();
	// 			});
	// 		});
	// 		db.get().hset('user:' + username, 'uid', uid, function(err, data) {
	// 			if(!err) {
	// 				eventbus.emit('user:setcommends', username, commends);
	// 			}
	// 		})
	// 	});
	// 			it('sets a users commends', function(done) {
	// 		var username = 'bdickason';
	// 		var commends = 53;
	// 		var uid = 0;

	// 		var _err = null;
	// 		var _username = 'bdickason';
	// 		var _commends = 53;
	// 		var _uid = 0;


	// 		eventbus.once('whisper:commendsset', function(err, username, amount) {
	// 			// Make sure event is being triggered properly
	// 			assert.equal(_err, err);
	// 			assert.equal(_username, username);
	// 			assert.equal(_commends, commends);
	// 			db.get().hgetall('user:' + username, function(err, data) {
	// 				// Make sure data is stored in db
	// 				assert.equal(_err, err);
	// 				assert.equal(_uid, data.uid);
	// 				assert.equal(_commends, data.commends);
	// 				done();
	// 			});
	// 		});
	// 		db.get().hset('user:' + username, 'uid', uid, function(err, data) {
	// 			if(!err) {
	// 				eventbus.emit('user:setcommends', username, commends);
	// 			}
	// 		})
	// 	});
	// });
	// 	describe('getCommends', function() {
	// 	it('No Parameter: gets your commends', function(done) {
	// 		var username = 'bdickason';
	// 		var commends = 53;
	// 		var uid = 0;

	// 		var _err = null;
	// 		var _username = 'bdickason';
	// 		var _commends = '53';
	// 		var _uid = 0;


	// 		eventbus.once('chat:commends', function(err, username, amount) {
	// 			// Make sure event is being triggered properly
	// 			assert.equal(_err, err);
	// 			assert.equal(_username, username);
	// 			assert.equal(_commends, commends);
	// 			done();
	// 		});

	// 		db.get().hmset('user:' + username, 'uid', uid, 'commends', commends, function(err, data) {
	// 			if(!err) {
	// 				eventbus.emit('user:getcommends', username);
	// 			}
	// 		})
	// 	});
	// });
});
