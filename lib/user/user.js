/* user.js - Users in our channel */

var db;
var eventbus = require('../eventbus');
var strings = require('../../config/strings.json');

var start = function start(database) {
	listenToTwitchJoin();
	listenToCommandSort();
	// Creates the user module
	// Input: db - pass in the db module
	if(database) {
		db = database;
	}
	else {
		throw ('Database not found');
	}
};

var listenToTwitchJoin = function() {
	// Add a user to the database
	// Input: username
	// Output: err, username
	eventbus.on('twitch:join', function(username) {
		add(username, function(err, name) {
			if(!err) {
				var response = [];
				response.push(strings.join.welcome + name + strings.join.new_here);
				eventbus.emit('say:added', response);
			}
			else {
				eventbus.emit('error:exists', 'User already exists');
			}
		});
	});
};

var listenToCommandSort = function() {
	// Add a user to the database
	// Input: username
	// Output: err, username
	eventbus.on('user:sort', function(username) {
		sorting(username, function(err, house) {
			if(err == "User not found") {
				line = strings.house.cannot_find + username;
			}
			else {
				// User exists, look up their house

				if(house && house != "muggle") {
					line = username + strings.house.proud_member_of + house;
				}
				else {
					line = username + strings.house.muggle;
				}
			}
			var response = [];
			response.push(line);
			eventbus.emit('say:sorted', response);
			});
		});
}
	// Listen to command:house
	// Listen to chat:join


var add = function add(username, callback) {
	// Create a new user (if it doesn't already exist)
	// input: username
	// output: true

	// Check if anything exists at user:bdickason
	db.get().hgetall('user:' + username, function(err, items) {
		var error = null;	// In case we need to throw our own error

		if(!err) {
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
		}
		else {
			callback(err, null);
		}
	});
};

var sorting = function sorting(username, callback) {
		// Sort a user into a specific house. This is binding and cannot be changed. All users are muggles until they've been sorted.
		// input: bdickason
		// output: hufflepuff

		var error = null;	// In case we need to throw our own error
		var house = null;

		if(!username) {
			err = "Invalid username";
			callback(err, house);
		}

		// Check if user exists

		db.get().hgetall('user:' + username, function(err, items) {

			var isEmpty = (Object.keys(items).length === 0)	// Hack to check for empty object
			if(isEmpty && !err) {
				// User exists - we need to add them first
				add(username, function(err, user) {
					sort(username, function (err, house) {
						callback(err, house);
					});
				});
			}
			else {
				// Make sure a user isn't already sorted (check their house)
				db.get().hget('user:' + username, 'house', function(err, items) {
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

var userAdd = function userAdd(username, callback) {
	// userAdd - Adds a user to the db
	// Input: username
	// Output: err, username

	// Find the next available unique identifier
	db.get().incr('user:uids', function(err, num) {
		var uid = num-1;	// Return the actual available uid, not the one after
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
	add: add,
	house: house,
	sorting: sorting
};
