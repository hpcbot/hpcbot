/* rules.js - !Command to display the rules of the HPC
*/

var strings = require('../../../config/strings.json');

var eventbus; // Global event bus that modules can pub/sub to
var db;

var start = function start(_eventbus, _db) {
	eventbus = _eventbus;
	db = _db;

	eventbus.on('house:get', getHouse);
	eventbus.on('house:set', setHouse);	// Apply to the Sorting Hat!
};

var getHouse = function getHouse(username, parameters) {
	// Tells chat what house a user belongs to
	var target;

	if(parameters) {
		// User is looking for someone else's house
		target = parameters;	
	}
	else {
		// User is looking for their own house
		target = username;
	}

	var response = [];

	db.get().hget('user:' + target, 'house', function(err, house) {
		if(!err) {
			if(house == null) {
				// User not found
				response.push(strings.house.cannot_find + target);
			}
			else {
				// Check if user is a muggle (unsorted) or member of a house
				if(house == 'muggle')
				{
					response.push(target + strings.house.muggle);
				}
				else {
					response.push(target + strings.house.proud_member_of + house);
				}
			}
			eventbus.emit('twitch:say', response);
		}
	});
};

var setHouse = function setHouse(username) {
	// Sort a user into a specific house. This is binding and cannot be changed. All users are muggles until they've been sorted.
	// input: bdickason
	// output: hufflepuff

	var response = [];

	var error = null;	// In case we need to throw our own error
	var house = null;

	// Check if user exists

	db.get().hgetall('user:' + username, function(err, items) { // User.exists();

		var isEmpty = (Object.keys(items).length === 0)	// Hack to check for empty object
		if(isEmpty && !err) {
			// User doesn't exist - we need to add them first
			// add(username, function(err, user) {	// User.add();
				sort(username, function (err, house) {
					if(!err) {
						response.push(strings.sorting.congrats + username + strings.sorting.joined_house + house);
						eventbus.emit('twitch:say', response);
					}					
				});
			// });
		}
		else {
			// Make sure a user isn't already sorted (check their house)
			if(items.house == 'muggle') {
				// User hasn't been sorted, sort away!
				sort(username, function (err, house) {
					if(!err) {
						response.push(strings.sorting.congrats + username + strings.sorting.joined_house + house);
						eventbus.emit('twitch:say', response);
					}
				});			
			}
			else {
				response.push(strings.sorting.user_already_sorted);
				eventbus.emit('twitch:say', response);
				
			}
		}
	});
};

var sort = function sort(username, callback) {
	// Logic to actually Sort user into a specific house
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
};

module.exports = {
	start: start
};