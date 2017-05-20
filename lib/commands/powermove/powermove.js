/* powermove.js - !Command to cause mental damage when an aegis is denied
*/

var path = require('path');

var eventbus; // Global event bus that modules can pub/sub to

// Configure Chat triggers so the bot listens for this command
var triggers = [{
	name: 'powermove',
	type: 'whisper',
	whitelist: true,
	event: 'powermove:start'
}];

// Setup an overlay to display a house when someone gets sorted
var	overlay = {
	name: 'powermove',									// The name of your overlay (for internal referral)
  event: 'stream:powermove',  						// The event that shows your overlay (required)
  view: path.join(__dirname, 'views/powermove.pug'),  // The view you want to be rendered (required)
  selector: '.powermove',  						// The selector to select your template (optional: default to a class w/ the  .name of the overlay)
	directory: path.join(__dirname)					// Grab the current directory
};

var start = function start(_eventbus) {
	eventbus = _eventbus;

	// Add event listeners from Twitch chat
	eventbus.on('powermove:start', powerMove);
};

var powerMove = function powerMove() {
	var response = [];

	// What should we show on stream?
	var payload = assemblePayload();
	eventbus.emit('stream:powermove', payload);
};

var assemblePayload = function() {
	// Put data into the proper format to be read by our stream overlay's template
	var payload = {};

	payload.powermove_video = overlay.name + '/video/powermove.mp4',
	payload.delay = 8000;

	return(payload);
}


module.exports = {
	start: start,
	overlay: overlay,
	triggers: triggers
};
