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
		var _users = null;

		// Find the next available unique identifier
		db.get().incr('user:uids', function(err, uid) {
			if(!err) {
				// add user to users hash
				db.get().hmset('user:' + 'bdickason', 'uid', uid, 'house', 'muggle', function(err, data) {
					// add userto list of usernames
					db.get().hset('users', 'bdickason', uid, function(err, data) {
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
		var _users = 'bdickason';

		Users.add('bdickason', function(err, users) {
			assert.equal(_err, err);
			assert.deepEqual(_users, users);
			done();
		});
	});

	it('add: New users are muggles by default', function(done) {
		var _err = null;
		var _house = 'muggle';

		Users.add('bdickason', function(err, users) {
			db.get().hgetall('user:bdickason', function (err, data) {
				assert.equal(err, _err);
				assert.equal(data.house, _house);
				done();
			});
		});
	});

	it('sort: Users can apply to be sorted by the sorting hat', function(done) {
		var userstate = {
			username: 'bdickason'
		};	// All twitch userstates are different o_O

		var _err = null;
		var _house = 'muggle';

		Users.add('bdickason', function(err, users) {
			Users.sorting(userstate, function(err, house) {
				assert.equal(err, _err);
				assert.notEqual(house, _house);
				done();
			});
		});
	});
});