/* user.js - Users in our channel */

var db;
var mixpanel;

var start = function start(_db, _mixpanel) {
	// Creates the user module
	// Input: db - pass in the db module, mixpanel - pass in the logging module
	
	db = _db;
	mixpanel = _mixpanel;
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
			db.get().hset('user:' + username, 'house', house, function(err, items) {
				if(!err) {
					// Add them to list of members for that house
					db.get().sadd('houses:' + house, username, function(err, items) {
						if(!err) {
							// Return the house they joined
							mixpanel.track('house:set', {
								distinct_id: username,
								house: house,
								channel: mixpanel.channel
							});
							mixpanel.people.set(username, 'house', house);

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
										mixpanel.track('user:create', {
											distinct_id: username,
											uid: uid,
											house: 'muggle',
											channel: mixpanel.channel
										});
										mixpanel.people.set(username,
										{
											uid: uid,
											house: 'muggle',
											channel: mixpanel.channel
										});
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

var getCommends = function getCommends(username, callback) {
	if(username) {
		exists(username, function(err, exists) {
			if(exists) {
				db.get().hget('user:' + username, 'commends', function(err, commends) {
					if(!err) {
						if(commends) {
							// User has commends
							callback(err, commends);
						}
						else {
							// User has no commends
							callback('User Has No Commends', null);
						}
					}
					else {
						callback(err, null);
					}
				});
			}
			else {
				callback('User Not Found', null);
			}
		});
	}
	else {
		// No user passed in
		callback('no user provided', null);
	}
};

var setCommends = function setCommends(username, commends, callback) {
	if(commends) {
		if(!isNaN(parameters)) {
			var commends = parseInt(parameters);

			db.get().hset('user:' + username, 'commends', commends, function(err, data) {
				if(!err) {
					mixpanel.track('commends:set', {
						distinct_id: username,
						commends: commends,
						channel: mixpanel.channel
					});
					mixpanel.people.set(username, 'commends', commends);

					response.push(strings.commends.saved + commends);
					eventbus.emit('twitch:whisper', username, response);
				}
			});
		} else {
			callback('commends not a number', null);
		}
	}
	else {
		// User passed in no commends
		callback('no commends provided', null);

	}
};

var getAll = function getAll(username, callback) {
	if(username) {
		db.get().hgetall('user:' + username, function(err, data) {
			if(!err) {
				callback(err, data);
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
	create: create,
	getCommends: getCommends,
	setCommends: setCommends,
	getAll: getAll
};
