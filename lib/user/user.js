/* user.js - Users in our channel */

var db = require('../db/db.js');

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

			var isEmpty = (Object.keys(items).length === 0)	// Hack to check for empty object
			if( !isEmpty && !err) {
				error = "User already exists";
				callback(error, null);
			}
			else {
				// Find the next available unique identifier
				db.get().incr('user:uids', function(err, num) {
					var uid = num;
					if(!err) {
						// add user to users hash
						// Users default to muggle until they're sorted
						db.get().hmset('user:' + username, 'uid', uid, 'house', 'muggle', function(err, data) {
							if(!err) {
								// add userto list of usernames
								db.get().hset('users', username, uid, function(err, data) {
									callback(err, username);	// Return uid if successful
								});
							} else {
								callback(err, null);
							}
						});
					}
				});		
			}
		})
	},
	house: function(username, callback) {
		// Check the house a user belongs to.

		db.get().hget('user:' + username, 'house', function(err, house) {
			if(!house) {
				callback("User not found", null);
			}
			else {
				callback(null, house);				
			}
		});

	},
	sorting: function(userstate, callback) {
		// Sort a user into a specific house. This is binding and cannot be changed. All users are muggles until they've been sorted.
		// input: bdickason
		// output: hufflepuff

		var username = userstate.username;

		// Check if user exists

		db.get().hget('user:' + username, 'uid', function(err, items) {
			// Make sure a user isn't already sorted (check their house)
			db.get().hget('user:' + username, 'house', function(err, items) {
				if(items == 'muggle') {
					// Generate random number b/t 0-3
					var houseNumber = Math.round(Math.random()*3);
					var house;

					// Match them to a house
					switch(houseNumber) {
						case 0:
							house = 'Gryffindor';
							break;
						case 1:
							house = 'Slytherin';
							break;
						case 2:
							house = 'Hufflepuff';
							break;
						case 3:
							house = 'Ravenclaw';
							break;
					}

					// Update user model
					db.get().hset('user:' + username, 'house', house, function(err, items) {
						if(!err) {
							db.get().sadd('houses:' + house, username, function(err, items) {
								if(!err) {
									// Return the house they joined
									callback(err, house);
								}
							});
						}
					});
				}
				else {
					var error = 'sorted';
					var house = null;
					callback(error, house);
				}
			});
		});
	}
}
