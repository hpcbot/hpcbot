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
	
	it('all: Gets a list of all users', function(done) {
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

	it('ids: Gets a list of all user ids', function(done) {
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

	it('id: Gets an individual user id from username', function(done) {
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

	it('add: Doesn\'t create a new user if one exists', function(done) {
		var _err = "User already exists"
		var _users = { uid: '1' };

		// Find the next available unique identifier
		db.get().incrby('user:uids', 1, function(err, num) {
			if(!err) {
				// add user to users hash
				db.get().hset('user:bdickason', 'uid', num, function(err, data) {
					// add userto list of usernames
					db.get().hset('users', 'bdickason', num, function(err, data) {
						Users.add('bdickason', function(err, users) {
							assert.equal(_err, err);
							assert.deepEqual(_users, users);
							done();
						});
					});
				});
			}
		});		
	});

	it('add: Creates a new user if one doesn\'t exist', function(done) {
		var _err = null;
		var _users = 1;

		Users.add('bdickason', function(err, users) {	// I wish the other tests were this easy ;()
			assert.equal(_err, err);
			assert.deepEqual(_users, users);
			done();
		});
	});
});