/* rules.js - !Command to display the rules of the HPC
*/

var strings = require('../../../config/strings.json');

var eventbus; // Global event bus that modules can pub/sub to
var db;

var start = function start(_eventbus, _db) {
	eventbus = _eventbus;
	db = _db;

	eventbus.on('house:get', getHouse);
};

var getHouse = function getHouse(username, parameters) {
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

module.exports = {
	start: start
};