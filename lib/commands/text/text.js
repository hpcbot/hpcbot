/* text.js - !Command to display and say Text to the stream */

var path = require('path');

var eventbus; // Global event bus that modules can pub/sub to

// Configure Chat triggers so the bot listens for this command
var triggers = [{
	name: 'text',
	type: 'whisper',
	whitelist: true,
	event: 'text:show'
}];

// Setup an overlay to display a house when someone gets sorted
var	overlay = {
	name: 'text',									// The name of your overlay (for internal referral)
  event: 'stream:text',  						// The event that shows your overlay (required)
  view: path.join(__dirname, 'views/text.pug'),  // The view you want to be rendered (required)
  selector: '.text',  						// The selector to select your template (optional: default to a class w/ the  .name of the overlay)
	directory: path.join(__dirname)					// Grab the current directory
};

var start = function start(_eventbus) {
	eventbus = _eventbus;

	// Add event listeners from Twitch chat
	eventbus.on(triggers[0].event, text);
};

var text = function text(username, text) {
	var response = [];

	// What should we show on stream?
	var payload = assemblePayload(username, text);
	eventbus.emit(overlay.event, payload);
};

var assemblePayload = function(username, text) {
	// Put data into the proper format to be read by our stream overlay's template
	var payload = {};

	if(text.length > 200) {
		// You know some jerk is gonna throw a long novel in
		text = text.substring(200);
	}

	payload.text_username = username;
	payload.text_text = text + ".tts"; // Hack to let us treat TTS specially

	return(payload);
}


module.exports = {
	start: start,
	triggers: triggers,
	overlay: overlay
};
