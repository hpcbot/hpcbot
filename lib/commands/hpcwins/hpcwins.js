/* hpcwins.js - !Command to cause mental damage when we win or make a big play
*/

var path = require('path');

var eventbus; // Global event bus that modules can pub/sub to

// Configure Chat triggers so the bot listens for this command
var triggers = [{
	name: 'hpcwins',
	type: 'whisper',
	whitelist: true,
	event: 'hpcwins:start'
}];

// Setup an overlay to display a house when someone gets sorted
var	overlay = {
	name: 'hpcwins',									// The name of your overlay (for internal referral)
  event: 'stream:hpcwins',  						// The event that shows your overlay (required)
  view: path.join(__dirname, 'views/hpcwins.pug'),  // The view you want to be rendered (required)
  selector: '.hpcwins',  						// The selector to select your template (optional: default to a class w/ the  .name of the overlay)
	directory: path.join(__dirname)					// Grab the current directory
};

var start = function start(_eventbus) {
	eventbus = _eventbus;

	// Add event listeners from Twitch chat
	eventbus.on(triggers[0].event, hpcwins);
};

var hpcwins = function hpcwins() {
	var response = [];

	// Load the items to show on stream
	var payload = assemblePayload();
	eventbus.emit(overlay.event, payload);
};

var assemblePayload = function() {
	// Put data into the proper format to be read by our stream overlay's template
	var payload = {};
	payload.hpcwins_video = overlay.name + '/video/hpcwins.mp4',
	payload.delay = 10000;

	return(payload);
}


module.exports = {
	start: start,
	overlay: overlay,
	triggers: triggers
};
