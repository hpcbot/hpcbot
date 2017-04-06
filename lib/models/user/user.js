/* user.js - Users in our channel */

var db;
var eventbus = require('../../eventbus');

var start = function start(database) {
	// Creates the user module
	// Input: db - pass in the db module
	if(database) {
		db = database;
	}
	else {
		throw ('Database not found');
	}

	listenToTwitchJoin();
	listenToCommandSort();
	listenToCommandHouse();
	listenToCommandSetCommends();
	listenToCommandGetCommends();
};

var listenToTwitchJoin = function() {
	// Add a user to the database
	// Input: username
	// Output: err, username
	eventbus.on('user:join', function(username) {
		add(username, function(err, name) {
			if(!err) {
				eventbus.emit('chat:joined', err, name);
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
	
			if(err) {
				// err: "sorted" User is already sorted

				// line = strings.sorting.user_already_sorted;
				// response.push(line);
				eventbus.emit('chat:sorted', err, username, null);

			}
			else {
				// Return the user's house

				eventbus.emit('chat:sorted', err, username, house);
				
			}			
		});
	});
}

var listenToCommandHouse = function() {
	// Get a user's House
	// Input: username
	// Output: err, username
	eventbus.on('user:house', function(username) {
		house(username, function(err, house) {
			if(err) {
				// err: User doesn't have a house
				eventbus.emit('chat:house', err, username, null);

			}
			else {
				// Return the user's house
				eventbus.emit('chat:house', err, username, house);
				
			}			
		});
	});
}

	// Listen to command:house


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
				// User doesn't exist - we need to add them first
				add(username, function(err, user) {
					sort(username, function (err, house) {
						callback(err, house);
					});
				});
			}
			else {
				// Make sure a user isn't already sorted (check their house)

					if(items.house == 'muggle') {
						// User hasn't been sorted, sort away!
						sort(username, function (err, house) {
							callback(err, house);
						});
						
					}
					else {
						error = 'sorted';
						house = null;
						callback(error, null);
					}
				// });
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
			// Add them to list of members for that house
			db.get().sadd('houses:' + house, username, function(err, items) {
				if(!err) {
					// Return the house they joined
					callback(err, house);
				}
				else {
					callback(err, null);
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

	var response = [];

	db.get().hget('user:' + username, 'house', function(err, house) {
		if(house == null) {
			callback("User not found", null);	
		}
		callback(err, house);
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
					// add userto list of uids
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

var listenToCommandSetCommends = function listenToCommandSetCommends() {
	// Sets commends (for Dobby because tbh noone else cares about commends)
	// Input: username, commends
	// Output: err, username, commends
	eventbus.on('user:setcommends', function(username, commends) {
		setCommends(username, commends, function(err, amount) {
			eventbus.emit('whisper:commendsset', err, username, amount);
		});
	});
};

var setCommends = function setCommends(username, commends, callback) {
	// Set Commends - Saves a user's commends
	// If user is a mod
		// If user exists
			// Set commends
	if(commends) {
		db.get().hset('user:' + username, 'commends', commends, function(err, data) {
			callback(err, data);
		});
	}
	else {
		// User passed in no commends
		callback('Error setting commends', null);
	}
};

var listenToCommandGetCommends = function listenToCommendGetCommends() {
	// Gets commends (for Dobby because tbh noone else cares about commends)
	// Input: username (optional)
	// Output: err, username, commends
	eventbus.on('user:getcommends', function(username) {
		// Get a specific users commends
		getCommends(username, function(err, amount) {
			if(!err) {
				eventbus.emit('chat:commends', err, username, amount);
			}
			else {
				eventbus.emit('error:issue', 'Error setting comments');
			}
		});
	});
}

var getCommends = function getCommends(username, callback) {
	// Get Commends - Retrieves a user's commends
	db.get().hget('user:' + username, 'commends', function(err, data) {
		if(!err) {
			callback(err, data);
		}
	});
};

module.exports = {
	start: start,
	add: add,
	house: house,
	sorting: sorting
};
