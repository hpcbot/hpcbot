/* user.js - Users in our channel */

var db;

var start = function start(_db) {
	// Creates the user module
	// Input: db - pass in the db module
	
	db = _db;
};

var getHouse = function getHouse(username, callback) {
	// Returns a user's house
	// Input: username
	// Output: error, 'Gryffindor'
	if(username) {
		db.get().hget('user:' + username, 'house', function(err, house) {
			callback(err, house);
		});
	}
	else {
		callback('no user provided', null);
	}
};

var setHouse = function setHouse(username, callback) {
	// Logic to actually Sort user into a specific house
	// Input: username
	// Output: err, 'Gryffindor'
	if(username) {
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
			db.get().hset('user:' + username, 'house', house, function(err, items) {	// User.set('house', ____)
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
	}
	else {
		callback('no user provided', null);
	}	
};


var exists = function exists(username, callback) {
	// Returns whether or not a user exists already
	// Input: username
	// Output: error, true
	if(username) {
		db.get().hget('user:' + username, 'uid', function(err, uid) {
			var exists = false;
			
			// Any user created should have a uid
			if(uid) {
				exists = true;
			}
			callback(err, exists);
		});
	}
	else {
		callback('no user provided', null);
	}
};

var create = function create(username, callback) {
	// TODO - Refactor this into standalone user model
	// userAdd - Adds a user to the db
	// Input: username
	// Output: err, username
	if(username) {
		// Make extra sure the user doesn't exist
		exists(username, function(err, exist) {
			if(!exist) {
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
			}
			else {
				callback('User already exists', null);
			}
		});
	}
	else {
		callback('no user provided', null);
	}	
};

module.exports = {
	start: start,
	getHouse: getHouse,
	setHouse: setHouse,
	exists: exists,
	create: create
};
