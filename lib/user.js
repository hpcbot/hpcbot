/* user.js - Users in our channel */

var db = require('../lib/db.js');

module.exports = {
	all: function(callback) {
		// Get a list of all users
		// input: (none)
		// output: ['bdickason']
		db.get().hkeys('users', function(err, items) {
			callback(items);
		});
	},
	ids: function(callback) {
		// Get a list of all user id's
		// input: (none)
		// output: ['1']
		db.get().hvals('users', function(err, items) {
			callback(items);
		});
	},
	id: function(username, callback) {
		// Get a single user's id
		// input: bdickason
		// output: ['1']
		db.get().hget('user:' + username, 'uid', function(err, items) {
			callback(items);
		})
	},
	add: function(username, callback) {
		// Create a new user (if it doesn't already exist)
		// input: username
		// output: true

		// Check if anything exists at user:bdickason
		db.get().hgetall('user:' + username, function(err, items) {
			var error = null;	// In case we need to throw our own error

			// console.log(items);
			// console.log(err);
			// console.log(items != {});
			var isEmpty = (Object.keys(items).length === 0)	// Hack to check for empty object
			if( !isEmpty && !err) {
				error = "User already exists";
				callback(error, items);
			}
			else {
				// Find the next available unique identifier
				db.get().incr('user:uids', function(err, num) {
					var uid = num;
					if(!err) {
						// add user to users hash
						db.get().hset('user:' + username, 'uid', uid, function(err, data) {
							// add userto list of usernames
							db.get().hset('users', username, uid, function(err, data) {
								callback(err, username);	// Return uid if successful
							});
						});
					}
				});		
			}
		})
		// Check if user exists in all
		// If so, ignore
		// If not:
		// * Increment user:uids
		// * Add user at user:(uid)
		// Callback success
	}
}
