/* gold.js - Earn goblin gold and buy your friends butter beer!
*/

var strings = require('../../../config/strings.json');

var eventbus; // Global event bus that modules can pub/sub to
var Resource;
var Channel;


// Configure Chat triggers so the bot listens for this command
var triggers = [{
	name: 'gold',
	type: 'whisper',
	whitelist: true,
	event: 'gold:add'
}];

var start = function start(_eventbus, _Resource, _Channel) {
	eventbus = _eventbus;
	Resource = _Resource;
	Channel = _Channel;

	eventbus.on(triggers[0].event, addGold);
};

var addGold = function addGold(username, parameters) {
	// Add points to a house

	var response = [];

	// Parse input for house + value
	if(parameters) {
		var value = parseInt(parameters);	// Second parameter should be a number

		if(value > 0) {
			give(value);
		} else {
			// Gold cannot be negative or zero
			response.push(strings.gold.error_greater_than_zero);
			eventbus.emit('twitch:whisper', username, response);
		}
	} else {
		// No parameters were passed
		response.push(strings.gold.error_no_params);
		eventbus.emit('twitch:whisper', username, response);
	}
};

var give = function give(value) {
	var response = [];

	// Check if users are in channel
	Channel.getActiveUsers(function(err, data) {
		if(!err && data) {
			// Add gold to each user
			var users = [];
			data.forEach(function(user) {
				Resource.give(user, value, function(err, success) {
					if(!err && success) {
						users.push(user);
						if(users.length === data.length) {
							// Foreach has completed
							response.push(strings.gold.gave + value + strings.gold.to_channel);
							eventbus.emit('twitch:say', response);
						}
					}
				});
			});
		}
	});
};

module.exports = {
	start: start,
	triggers: triggers
};
