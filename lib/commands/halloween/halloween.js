/* halloween.js - !Commands to start the Halloween Event
*/

var strings = require('../../../config/strings.json');

var eventbus; // Global event bus that modules can pub/sub to
var Team;

// Configure Chat triggers so the bot listens for this command
var triggers = [{
	name: 'spook',
	type: 'whisper',
	whitelist: true,
	event: 'halloween:spook'
}];

var start = function start(_eventbus, _Team) {
	eventbus = _eventbus;
	Team = _Team;

	// Add event listeners from Twitch chat
	eventbus.on(triggers[0].event, spook);
};

var spook = function spook(username, parameters) {
	var response = [];
  var house;
  var value = 5;  // Add or subtract 5 points to a house
	var abbrhouse;
	var hweenoverlay = 'overlays:hween';

  var houseNumber = Math.floor(Math.random() * (4)); // Generate a random number between 0-3

  switch(houseNumber) {
    case 0:
      house = 'Gryffindor';
      abbrhouse = 'g';
      break;
    case 1:
      house = 'Hufflepuff';
      abbrhouse = 'h';
      break;
    case 2:
      house = 'Ravenclaw';
      abbrhouse = 'r';
      break;
    case 3:
      house = 'Slytherin';
      abbrhouse = 's';
      break;
	}
	hweenoverlay += abbrhouse;

	var addOrSub = Math.floor(Math.random() * (2)); // Generate a random number between 0-1

  switch(addOrSub) {
    case 0:
      // Add points to house
			hweenoverlay += 'win:show';
			Team.add(house, value, function(err, data) {
        if(!err && data) {
					eventbus.emit(hweenoverlay);  // Show the halloween overlay
					setTimeout(function() {
						response.push(strings.cup.added + 5 + strings.cup.points_to + house);
	          eventbus.emit('twitch:say', response);
						eventbus.emit('gold:overlay');
					}, 55000);
				} else {
          response.push('Failed to add points to house ' + house);
          eventbus.emit('twitch:whisper', username, response);
        }
      });
      break;
    case 1:
      // Subtract points from house
			hweenoverlay += 'lose:show';
			Team.remove(house, value, function(err, data) {
        if(!err && data) {
					eventbus.emit(hweenoverlay);  // Show the halloween overlay
					setTimeout(function() {
						response.push(strings.cup.removed + 5 + strings.cup.points_from + house);
						eventbus.emit('twitch:say', response);
					}, 55000);
        } else {
          response.push('Failed to subtract points from house ' + house);
          eventbus.emit('twitch:whisper', username, response);
        }
      });
      break;
  }
}

module.exports = {
  start: start,
  spook: spook,
  triggers: triggers
};
