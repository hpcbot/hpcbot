/* team.js - A team of players that can earn points */

var db;
var mixpanel;

var start = function (_db, _mixpanel) {
	// Creates the team module
	// Input: db - pass in the db module

	db = _db;
	mixpanel = _mixpanel;
};

/*
var get = function(house, callback) {
	if(username) {
		db.get().hget('cup:' + house, 'score', function(err, data) {
			if(err || data) {
					callback(err, data);
			}
			else {
				// User has no resources
				callback(null, 0);
			}
		});
	}
	else {
		callback('no user provided', null);
	}
}; */

var add = function(username, amount, callback) {
	// Add the amount to a user and store it in the db
	// Input: username, amount (positive or negative)
	// Output: error, final sum saved to user's account
	if(username) {
		if(amount) {
			if(!isNaN(amount)) {
				// Set key for user's resource
				db.get().hincrby('user:' + username, 'resource', amount, function(err, data) {
					if(!err) {
						// Add to global resource list (for leaderboards or hax0rs)
						db.get().hincrby('resources', username, amount, function(err, data) {
							if(!err) {
								callback(null, data);
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
				callback('amount must be a number', null);
			}
		}
		else {
			callback('no amount provided', null);
		}
	}
	else {
		callback('no user provided', null);
	}
};

// var reset
var reset = function(callback) {
	// Reset the scores for each house for the house cup
	// Input: none
	// Output: error, success (message)

	// Set each house to zero
	db.get().mset(
		'cup:Gryffindor', 0,
		'cup:Hufflepuff', 0,
		'cup:Ravenclaw', 0,
		'cup:Slytherin', 0, function(err, data) {
		if(!err) {
			// Callback that the cup has begun!
			callback(null, true);
		}
		else {
			callback(err, null);
		}
	});
}

module.exports = {
	start: start,
	// get: get,
	reset: reset
};
