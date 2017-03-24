/* Test for lib/user.js */

var assert = require('assert');

var db = require('../lib/db.js');
db.connect('mode_staging');

var Users = require('../lib/user.js');


describe('Users', function() {
	beforeEach(function(done) {
		// Wipe database before running tests. Note: Make _SURE_ you are on staging
		db.get().flushdb(function(err) {
			if(!err) {
				done();
			}
		});
	});
	
	it('Gets a list of all users', function(done) {
		var _users = ['bdickason'];

		// Find the next available unique identifier
		db.get().incr('user:uids', function(err, num) {
			if(!err) {
				// add user to users hash
				db.get().hset('user:bdickason', 'uid', num, function(err, data) {
					// add userto list of usernames
					db.get().hset('users', 'bdickason', num, function(err, data) {
						Users.all(function(users) {
							assert.deepEqual(_users, users);
							done();
						});
					});
				});
			}
		});		
	});

	it('Gets a list of all user ids', function(done) {
		var _users = ['1'];

		// Find the next available unique identifier
		db.get().incr('user:uids', function(err, num) {
			if(!err) {
				// add user to users hash
				db.get().hset('user:bdickason', 'uid', num, function(err, data) {
					// add userto list of usernames
					db.get().hset('users', 'bdickason', num, function(err, data) {
						Users.ids(function(users) {
							assert.deepEqual(_users, users);
							done();
						});
					});
				});
			}
		});		
	});

	it('Gets an individual user id from username', function(done) {
		var _users = ['5'];
		// Find an arbitrary unique identifier that is not 1
		db.get().incrby('user:uids', 5, function(err, num) {
			if(!err) {
				// add user to users hash
				db.get().hset('user:bdickason', 'uid', num, function(err, data) {
					// add userto list of usernames
					db.get().hset('users', 'bdickason', num, function(err, data) {
						Users.ids(function(users) {
							assert.deepEqual(_users, users);
							done();
						});
					});
				});
			}
		});		
	});
});
					// Get individual user:
					// db.get().hget('user:' + num, 'username', function(err, data) {
						// assert.equal(_numUsers, num);
						// assert.equal(_username, data);
						// done();
					// });