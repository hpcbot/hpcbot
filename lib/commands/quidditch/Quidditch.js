/* quidditch.js - Start a quidditch match between the houses
*/

var path = require('path');
var strings = require('../../../config/strings.json');

var eventbus; // Global event bus that modules can pub/sub to

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
  event: 'stream:quidditch',  						// The event that shows your overlay (required)
  view: path.join(__dirname, 'views/quidditch.pug'),  // The view you want to be rendered (required)
  selector: '.quidditch',  						// The selector to select your template (optional: default to a class w/ the  .name of the overlay)
	directory: path.join(__dirname) + '/static'					// Grab the directory to server static files from
};

var start = function start(_eventbus) {
	eventbus = _eventbus;

	// Add event listeners from Twitch chat
	eventbus.on(triggers[0].event, play);  // Play a game of quidditch
  // eventbus.on('quidditch:winner', winner);
};

var play = function play() {
	// Start a game of Quidditch

	// var response = [];
	eventbus.emit(overlay.event, {event: 'quidditch'});
};

var assemblePayload = function(username, house) {
	// Put data into the proper format to be read by our stream overlay's template
	var payload = {};

	payload.username = username;

	switch(house) {
		case 'Hufflepuff':
				payload.house_text = 'Hufflepuff',
			  	payload.house_image = overlay.name + '/images/hufflepuff.png',
			  	payload.house_audio = overlay.name + '/audio/hufflepuff.m4a'
			break;
			case 'Gryffindor':
				payload.house_text = 'Gryffindor',
			  	payload.house_image = overlay.name + '/images/gryffindor.png',
			  	payload.house_audio = overlay.name + '/audio/gryffindor.m4a'
			break;
			case 'Ravenclaw':
				payload.house_text = 'Ravenclaw',
			  	payload.house_image = overlay.name + '/images/ravenclaw.png',
			  	payload.house_audio = overlay.name + '/audio/ravenclaw.m4a'
			break;
			case 'Slytherin':
				payload.house_text = 'Slytherin',
			  	payload.house_image = overlay.name + '/images/slytherin.png',
			  	payload.house_audio = overlay.name + '/audio/slytherin.m4a'
			break;
	}
	return(payload);
}


module.exports = {
	start: start,
	overlay: overlay,
	triggers: triggers
};
