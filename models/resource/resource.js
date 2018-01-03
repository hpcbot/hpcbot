/* resources.js - A (fake!) resource that you can manage and earn :) */

var db;
var eventbus;

var start = function (_db, _eventbus) {
	// Creates the resource module
	// Input: db - pass in the db module

	db = _db;
	eventbus = _eventbus;
};

var give = function(username, amount, callback) {
	// Give resource to a single user
	// Input: username, amount
	// Output: error, resulting resource amount;

	if(amount >= 0) {
		add(username, amount, function(err, data) {
			eventbus.emit('log:info', 'resource:give', {username: username, amount: amount });
			callback(err, data);
		});
	}
	else {
		callback('amount must be greater than zero', null);
	}
};

let giveMany = (users, amount, callback) => {
	// Give resources to a group of users
	// Input: [users], amount (positive or negative)
	// Output: error, number of users affected
	if(users && Array.isArray(users) && users.length > 0) {
		if(amount) {
			if(!isNaN(amount)) {
				let count = 0	// Get number of users

				users.forEach((user) => {
					// Set key for user's resource
					add(user, amount, (err, data) => {
						count++
						if(!err) {
							if(count == users.length) {
								callback(null, count)
							}
						} else {
							if(count == users.length) {
								callback(err, null)
							}
						}
					})
				})
			} else {
				callback('amount must be a number', null);
			}
		} else {
			callback('no amount provided', null);
		}
	} else {
		callback('no users provided', null);
	}
}

var take = function(username, amount, callback) {
	// Take resource from a user
	// Input: username, amount
	// Output: error, resulting resource amount;

	if(amount >= 0) {
		var adjustedAmount = -amount;
		add(username, adjustedAmount, function(err, data) {
			eventbus.emit('log:info', 'team:take', {username: username, amount: adjustedAmount });
			callback(err, data);
		});
	}
	else {
		callback('amount must be greater than zero', null);
	}
};

var get = function(username, callback) {
	// Check the user's current resource amount
	// Input: username
	// Output: error, amount user has to spend

	if(username) {
		db.get().hget('user:' + username, 'resource', function(err, data) {
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
};

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



module.exports = {
	start,
	give,
	giveMany,
	take,
	get
};
