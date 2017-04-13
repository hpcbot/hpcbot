/* house.js - !Command to set and get a user's house
*/

var strings = require('../../../config/strings.json');

var eventbus; // Global event bus that modules can pub/sub to
var User;

var start = function start(_eventbus, _User) {
	eventbus = _eventbus;
	User = _User;

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

	User.getHouse(target, function(err, house) {
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
	User.exists(username, function(err, exists) {
		if(!exists) {
			// User doesn't exist - we need to add them first
			User.create(username, function(err, user) {
				User.setHouse(user, function (err, house) {
					if(!err) {
						response.push(strings.sorting.congrats + user + strings.sorting.joined_house + house);
						eventbus.emit('twitch:say', response);
						eventbus.emit('stream:house', house);
					}					
				});
			});
		}
		else {
			User.getHouse(username, function(err, house) {
				// Make sure a user isn't already sorted (check their house)
				if(house == 'muggle') {
					// User hasn't been sorted, sort away!
					User.setHouse(username, function (err, house) {
						if(!err) {
							response.push(strings.sorting.congrats + username + strings.sorting.joined_house + house);
							eventbus.emit('twitch:say', response);
							eventbus.emit('stream:house', house);
						}
					});			
				}
				else {
					response.push(strings.sorting.user_already_sorted);
					eventbus.emit('twitch:say', response);		
				}
			});
		}		
	});
};



module.exports = {
	start: start
};