/* Test for lib/channel.js */

var assert = require('chai').assert;
var sinon = require('sinon');

var EventEmitter = require('events');
var eventbus = new EventEmitter;	// Temporary event bus to prevent events firing across files

var db = require('../../db');
db.connect('mode_staging');	// Do not remove this or you will wipe your data

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

		this.sinon = sandbox = sinon.sandbox.create();
	});
	it('Properly sets the list variable to listen to', function() {
		// Safety net because changing this could delete data
		// Only change if you explicitly mean to
		var _list = 'channel';

		assert.equal(Channel.list, _list);
	});

	describe('Get Active Users', function() {
		it('Returns a list of users', function(done) {
			var users = ['hpc_dumbledore', 'bdickason'];

			var _users = ['hpc_dumbledore', 'bdickason'];

			db.get().lpush(Channel.list, users, function(err, data) {
				if(!err) {
					Channel.getActiveUsers(function(err, users) {
							if(!err) {
								assert.include(users, _users[0]);
								assert.include(users, _users[1]);
								done();
							}
					});
				}
			});
		});
	});

	describe('Set Active Users', function() {
		it('Saves over an empty list', function(done) {
			var users = ['hpc_dumbledore', 'bdickason'];

			var _users = ['hpc_dumbledore', 'bdickason'];

			// Set new values in the db
			Channel.setActiveUsers(users, function(err, data) {
				if(!err) {
					// Get current values in the db
					db.get().lrange(Channel.list, 0, -1, function(err, data) {
						assert.include(data, _users[0]);
						assert.include(data, _users[1]);
						done();
					});
				}
			});
		});
		it('Overwrites an existing list', function(done) {
			var users = ['hpc_dumbledore', 'bdickason'];

			var _users = ['hpc_dumbledore', 'bdickason'];
			db.get().lpush(Channel.list, ['teamalea', 'boots_mcscootin'], function(err, data) {
				// Set new values in the db
				Channel.setActiveUsers(users, function(err, data) {
					if(!err) {
						// Get current values in the db
						db.get().lrange(Channel.list, 0, -1, function(err, data) {
							assert.include(data, _users[0]);
							assert.include(data, _users[1]);
							done();
						});
					}
				});
			});
		});
	})

	describe('Update User List', function() {
		it('Updates the user list with the latest group of users', function(done) {
			var users = ['hpc_dumbledore', 'bdickason'];

			var _users = ['hpc_dumbledore', 'bdickason'];
			db.get().lpush(Channel.list, ['teamalea', 'boots_mcscootin'], function(err, data) {

				eventbus.once('user:join', function() {
					// Get current values in the db
					db.get().lrange(Channel.list, 0, -1, function(err, data) {
						assert.include(data, _users[0]);
						assert.include(data, _users[1]);
						assert.notInclude(data, 'teamalea');
						assert.notInclude(data, 'boots_mcscootin');
						done();
					});
				});

				// Set new values in the db
				eventbus.emit('twitch:users', users);
			});
		});
		it('Fires a join event for each new user that joins (and ignores users that have left)', function(done) {
			var oldUsers = ['boots_mcscootin', 'teamalea'];
			var users = ['teamalea', 'bdickason', 'hpc_dumbledore'];

			var _newUsers = ['bdickason', 'hpc_dumbledore'];

			Channel.setActiveUsers(oldUsers, function(err, data) {

				eventbus.once('user:join', function(users) {
						assert.equal(users.length, 2);
						assert.include(users, _newUsers[0]);
						assert.include(users, _newUsers[1]);
						assert.notInclude(users, 'teamalea');
						assert.notInclude(users, 'boots_mcscootin');
						done();
					});

				eventbus.emit('twitch:users', users);


			});




		});
	});
});
