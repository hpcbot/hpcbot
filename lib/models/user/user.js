/* user.js - Users in our channel */

var db;
var eventbus;

var start = function start(_eventbus, _db) {
	// Creates the user module
	// Input: db - pass in the db module

	eventbus = _eventbus;		
	db = _db;

	listenToCommandSetCommends();
	listenToCommandGetCommends();
};

// var listenToTwitchJoin = function() {
// 	// Add a user to the database
// 	// Input: username
// 	// Output: err, username
// 	eventbus.on('user:join', function(username) {
// 		add(username, function(err, name) {
// 			if(!err) {
// 				eventbus.emit('chat:joined', err, name);
// 			}
// 			else {
// 				eventbus.emit('error:exists', 'User already exists');
// 			}
// 		});
// 	});
// };

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

// var userAdd = function userAdd(username, callback) {
// 	// userAdd - Adds a user to the db
// 	// Input: username
// 	// Output: err, username

// 	// Find the next available unique identifier
// 	db.get().incr('user:uids', function(err, num) {
// 		var uid = num-1;	// Return the actual available uid, not the one after
// 		if(!err) {
// 			// add user to users hash
// 			// Users default to muggle until they're sorted
// 			db.get().hmset('user:' + username, 'uid', uid, 'house', 'muggle', function(err, data) {
// 				if(!err) {
// 					// add userto list of uids
// 					db.get().hset('users', username, uid, function(err, data) {
// 						if(!err) {
// 							callback(err, username);	// Return username if successful							
// 						}
// 						else {
// 							callback(err, null);
// 						}
// 					});
// 				} else {
// 					callback(err, null);
// 				}
// 			});
// 		}
// 		else {
// 			callback(err, null);
// 		}
// 	});		
// };

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
	add: add
};
