/* gold.js - Earn goblin gold and buy your friends butter beer!
*/

var strings = require('../../../config/strings.json');
var later = require('later');

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

	// Initialize gold timer
	var amounts = {
		timer: 5,
		overlay: 1
	};			// How much gold should we give out?
	var interval = 15;	// How often should we give out gold? (Minutes)

	eventbus.on(triggers[0].event, goldCommand);
	eventbus.on('gold:overlay', function() { goldOverlay(amounts.overlay)});


	goldTimer(amounts.timer, interval);
};

var goldCommand = function addGoldCommand(username, parameters) {
	// Chat trigger to add a fixed amount of gold to users in the channel

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

var goldTimer = function goldTimer(amount, interval) {
	// Periodically disperse gold to the channel

	var response = [];

	console.log('Gold timer initialized');

	// Setup 15m Timer
	// var sched = later.parse.text('every ' + interval + ' minutes');
	var sched = later.parse.text('every ' + interval + ' seconds');
	var timer = later.setInterval(function() {

		if(Channel.isLive()) {
			give(amount);
			// Fire gold video overlay
			eventbus.emit('gold:show');
		}
	}, sched);
};

var goldOverlay = function goldOverlay(amount) {
	// Each time an overlay is played, give gold to the channel

	var response = [];

	if(Channel.isLive()) {
		give(amount);
	}
}

var give = function give(value) {
	var response = [];

	// Make sure channel is live before giving out any gold
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
