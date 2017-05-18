/* gift.js - !Command to cause mental damage when we win or make a big play
*/

var path = require('path');

var eventbus; // Global event bus that modules can pub/sub to

// Setup an overlay to display a house when someone gets sorted
var	overlay = {
	name: 'gift',									// The name of your overlay (for internal referral)
  event: 'stream:gift',  						// The event that shows your overlay (required)
  view: path.join(__dirname, 'views/gift.pug'),  // The view you want to be rendered (required)
  selector: '.gift',  						// The selector to select your template (optional: default to a class w/ the  .name of the overlay)
	directory: path.join(__dirname)					// Grab the current directory
};

var start = function start(_eventbus) {
	eventbus = _eventbus;

	// Add event listeners from Twitch chat
	eventbus.on('gift:start', gift);
};

var gift = function gift() {
	var response = [];

	// Load the items to show on stream
	var payload = assemblePayload();
	eventbus.emit('stream:gift', payload);
};

var assemblePayload = function() {
	// Put data into the proper format to be read by our stream overlay's template
	var payload = {};
	payload.gift_video = overlay.name + '/video/gift.mp4',
	payload.delay = 10000;

	return(payload);
}


module.exports = {
	start: start,
	overlay: overlay
};
