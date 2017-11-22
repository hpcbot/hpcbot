/* text.js - !Command to have the bot display and read text
*/

var eventbus;	// Global event bus that modules can pub/sub to

// Configure Chat triggers so the bot listens for this command
var triggers = [{
	name: 'text',
	type: 'chat',
	// whitelist: true,
	event: 'text:show'
}];

var start = function start(_eventbus) {
	eventbus = _eventbus;
	eventbus.on(triggers[0].event, text);
};

var text = function text(username, text) {
	var response = [];

	// What should we show on stream?
	var payload = assemblePayload(username, text);
	eventbus.emit('overlay:text:show', payload);
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
	triggers: triggers
};
