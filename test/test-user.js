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
		var _users = ['1'];

		// Find the next available unique identifier
		db.get().incr('user:uids', function(err, num) {
			if(!err) {
				// add user to users hash
				db.get().hset('user:' + num, 'username', 'bdickason', function(err, data) {
					// add user to list of users
					db.get().sadd('users:all', num, function(err, data) {
						// Check actual function
						Users.all(function(users) {
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