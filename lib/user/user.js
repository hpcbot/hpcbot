/* user.js - Users in our channel */

var db;
var eventbus = require('../eventbus');

var start = function start(database) {
	// Creates the user module
	// Input: db - pass in the db module
	if(database) {
		db = database;
	}
	else {
		throw ('Database not found');
	}
};

var add = function add(username, callback) {
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
			userAdd(username, function(err, user) {
				if(!err) {
					callback(err, user);
				}
				else {
					callback(err, null);
				}
			});
		}
	})
};


/*
var listenToJoins = function() {
	// User said something in the channel 
	// Input: username, line of text
	// Output: username, command, parameters 
	eventbus.on('twitch:chat', function(channel, userstate, message, self) {
		parse(userstate, message, self, function(err, username, command, parameters) {
			if(!err) {
				eventbus.emit('chat:command', username, command, parameters);
			}
		});
	});
}; 


var all = function all(callback) {
	// Get a list of all users
	// input: (none)
	// output: ['bdickason']
	db.get().hkeys('users', function(err, items) {
		callback(items);
	});
};

var ids = function ids(callback) {
		// Get a list of all user id's
		// input: (none)
		// output: ['1']
		db.get().hvals('users', function(err, items) {
			callback(items);
		});
	};

var id = function id(username, callback) {
		// Get a single user's id
		// input: bdickason
		// output: ['1']
		db.get().hget('user:' + username, 'uid', function(err, items) {
			callback(items);
		})
	};




var house = function house(username, callback) {
	// Check the house a user belongs to.

	db.get().hget('user:' + username, 'house', function(err, house) {
		if(!house) {
			callback("User not found", null);
		}
		else {
			callback(null, house);				
		}
	});

};

var sorting = function sorting(userstate, callback) {
		// Sort a user into a specific house. This is binding and cannot be changed. All users are muggles until they've been sorted.
		// input: bdickason
		// output: hufflepuff

		var username = userstate.username;

		// Check if user exists

		db.get().hgetall('user:' + username, function(err, items) {
			var error = null;	// In case we need to throw our own error
			var house = null;

			var isEmpty = (Object.keys(items).length === 0)	// Hack to check for empty object
			if(isEmpty && !err) {
				console.log("User does not exist");
				// User exists - we need to add them first
				userAdd(username, function(err, user) {
					sort(username, function (err, house) {
						callback(err, house);
					});
				});
			}
			else {
				// Make sure a user isn't already sorted (check their house)
				db.get().hget('user:' + username, 'house', function(err, items) {
					console.log('house: '+ items);
					if(items == 'muggle') {
						// User hasn't been sorted, sort away!
						sort(username, function (err, house) {
							callback(err, house);
						});
						
					}
					else {
						error = 'sorted';
						house = null;
						callback(error, house);
					}
				});
			}
		});
	};

var sort = function sort(username, callback) {
	// Sorts user into a specific house
	// Input: username
	// Output: err, house

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
		else {
			callback(err, null);
		}
	});

}; */

var userAdd = function userAdd(username, callback) {
	// userAdd - Adds a user to the db
	// Input: username
	// Output: err, username

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
						if(!err) {
							callback(err, username);	// Return username if successful							
						}
						else {
							callback(err, null);
						}
					});
				} else {
					callback(err, null);
				}
			});
		}
		else {
			callback(err, null);
		}
	});		
};

module.exports = {
	start: start,
	add: add
};
