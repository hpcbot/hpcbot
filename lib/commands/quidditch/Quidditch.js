/* quidditch.js - Start a quidditch match between the houses
*/

var path = require('path');
var strings = require('../../../config/strings.json');
var _ = require('../../utils');

var eventbus; // Global event bus that modules can pub/sub to

var Team;
var delay;

// Configure Chat triggers so the bot listens for this command
var triggers = [{
	name: 'quidditch',
	type: 'whisper',
	whitelist: true,
	event: 'quidditch:start'
}];

// Setup an overlay to display the quidditch match
var	overlay = {
	name: 'quidditch',									// The name of your overlay (for internal referral)
	type: 'html',
  view: path.join(__dirname, 'views/quidditch.pug'),  // The view you want to be rendered (required)
	static: path.join(__dirname) + '/static'						// Grab the directory to server static files from
};

var start = function start(_eventbus, _Team, options = {delay: 20000}) {
	eventbus = _eventbus;
	Team = _Team;

	delay = options.delay;

	// Add event listeners from Twitch chat
	eventbus.on(triggers[0].event, play);  // Play a game of quidditch
	eventbus.on('quidditch:winner', winner);	// Celebrate the winner
  // eventbus.on('quidditch:winner', winner);
};

var play = function play() {
	// Start a game of Quidditch (runs client side - see static/js/quidditch-client.js)

	eventbus.emit(overlay.event, {event: 'quidditch'});
};

var winner = function winner(house) {
	// Declare the winner and give them some damn gold
	var response = [];
	var value = 5;

	// Pay winners
	Team.add(house, value, function(err, data) {
		if(!err && data) {
			// Show overlay
			var houseShort = house.substr(0, 1).toLowerCase();
			var event = 'overlays:q' + houseShort + 'w' + ':show';
			eventbus.emit(event);

			// Tell chat
			setTimeout(function() {
				response.push(strings.cup.added + 5 + strings.cup.points_to + house);
				eventbus.emit('twitch:say', response);
			}, delay);	// 10 second pause to account for twitch stream delay
		}
	});
}



module.exports = {
	start: start,
	overlay: overlay,
	triggers: triggers
};
