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

var add = function(house, amount, callback) {
	// Add the amount to a house and store it in the db
	// Input: username, amount (positive or negative)
	// Output: error, final sum saved to user's account
	if(house) {
		if(amount) {
			if(!isNaN(amount)) {
				// Bump the house's score
				db.get().hincrby('cup', house, amount, function(err, data) {
					if(!err) {
						callback(null, data);
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
		callback('no house provided', null);
	}
};

// var reset
var reset = function(callback) {
	// Reset the scores for each house for the house cup
	// Input: none
	// Output: error, success (message)

	// Set each house to zero
	db.get().hmset('cup',
		'Gryffindor', 0,
		'Hufflepuff', 0,
		'Ravenclaw', 0,
		'Slytherin', 0, function(err, data) {
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
