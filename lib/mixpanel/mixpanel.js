/* mixpanel.js - Wrap Mixpanel logging to gather analytics and usage metrics */

var Mixpanel = require('mixpanel');

var eventbus;
var mixpanel;

var start = function start(options) {
	// events: accepts an eventemitter (like eventbus)
	// channel: twitch channel to attribute all logs to
	// token: (optional) your token to connect to mixpanel. Without this, any logging events will be ignored

	eventbus = options.events;
	channel = options.channel;
	token = options.token;

	console.log(token);
	// Initialize Mixpanel
	if(token) {
		mixpanel = Mixpanel.init(token);
		mixpanel.channel = channel;

		// Initialize event listeners

		// Track:
		// event - Accepts an event e.g. 'overlay:shown'
		// parameters - Accepts an object
		eventbus.on('mixpanel:track', mixpanel.track);	// Passes through event to mixpanel.track function https://mixpanel.com/help/reference/javascript#sending-events

		// Mixpanel is initiated successfully
		eventbus.emit('mixpanel:init', true);
	} else {
		// Mixpanel is not initiated
		eventbus.emit('mixpanel:init', false);
	}
};

module.exports = {
	start: start
};
