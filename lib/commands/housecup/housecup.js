/* housecup.js - !Commands to award and remove points from houses
*/

var strings = require('../../../config/strings.json');

var eventbus; // Global event bus that modules can pub/sub to
var User;

// Configure Chat triggers so the bot listens for this command
var triggers = [{
	name: 'cup',
	type: 'chat',
	event: 'cup:show'
},{
	name: 'add',
	type: 'whisper',
	whitelist: true,
	event: 'cup:add'
},{
	name: 'reset-cup',
	type: 'whisper',
	whitelist: true,
	event: 'cup:reset'
}];

/*
House Cup: !cup

**Whisper**
!d s 5 / 10
!a s 5 / 10

!cup - Shows standings on screen

!winner s
*/

var start = function start(_eventbus, _Team) {
	eventbus = _eventbus;
	Team = _Team;

	eventbus.on(triggers[0].event, showCup);
	eventbus.on(triggers[1].event, addPoints);
	eventbus.on(triggers[2].event, resetCup);
};

var showCup = function showCup() {
	// Show the team standings in the house cup

	var response = [];

	// Get all current teams' standings in the cup
	Team.getAll (function(err, standings) {
		if(!err && standings) {

			// Check if object is empty (no standings)
			if(Object.keys(standings).length === 0) {
				response.push(strings.cup.not_started);
				eventbus.emit('twitch:say', response);
			}
			else {
				// Sort the standings highest to lowest
				var sorted = [];

				for (var house in standings) {
					sorted.push([house, standings[house]]);
				}

				sorted.sort(function(a, b) {
					return b[1] - a[1];
				});

			response.push(strings.cup.standings);
			response.push('1. ' + sorted[0][0] + strings.cup.spacer  + sorted[0][1]);
			response.push('2. ' + sorted[1][0] + strings.cup.spacer  + sorted[1][1]);
			response.push('3. ' + sorted[2][0] + strings.cup.spacer  + sorted[2][1]);
			response.push('4. ' + sorted[3][0] + strings.cup.spacer  + sorted[3][1]);

			eventbus.emit('twitch:say', response);
			}
		}
	});
};

var addPoints = function addPoints(username, parameters) {
	// Add points to a house

	var response = [];

	// Parse input for house + value
	if(parameters) {

		parameters = parameters.split(' ')
		var house = parameters[0];	// First parameter should be a letter
		var value = parseInt(parameters[1]);	// Second parameter should be a number

		// Parse input - house
		if(house == 'g' || house == 'h' || house == 'r' || house == 's') {
			switch(house) {
				case 'g':
					house = 'Gryffindor';
					break;
				case 'h':
					house = 'Hufflepuff';
					break;
				case 'r':
					house = 'Ravenclaw';
					break;
				case 's':
					house = 'Slytherin';
					break;
			}
			if(value) {
				if(value == 5 || value == 10) {
					// Both inputs are valid - let's go!
					Team.add(house, value, function(err, data) {
						if(!err && data) {
							response.push(strings.cup.added + value + strings.cup.points_to + house);
							eventbus.emit('twitch:whisper', username, response);
						} else {
							response.push(err);
							eventbus.emit('twitch:whisper', username, response);
						}
					});
				} else {
					response.push(strings.cup.error_bad_points);
					eventbus.emit('twitch:whisper', username, response);
				}
			} else {
				response.push(strings.cup.error_no_points);
				eventbus.emit('twitch:whisper', username, response);
			}
		} else {
			response.push(strings.cup.error_bad_house);
			eventbus.emit('twitch:whisper', username, response);
		}
	} else {
		response.push(strings.cup.error_no_params);
		eventbus.emit('twitch:whisper', username, response);
	}
};

var resetCup = function showCup(username, parameters) {
	// Reset team standings in the house cup

	var response = [];

	Team.reset (function(err, data) {
		if(!err && data) {
			response.push(strings.cup.reset);

			eventbus.emit('twitch:whisper', username, response);
		}
	});
};

module.exports = {
	start: start,
	triggers: triggers
};
