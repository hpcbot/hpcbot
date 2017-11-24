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

	// Initialize Mixpanel
	if(token) {
		mixpanel = Mixpanel.init(token);
		mixpanel.channel = channel;

		// Initialize event listeners

		// Track:
		// event - Accepts an event e.g. 'overlay:shown'
		// parameters - Accepts an object
		eventbus.on('mixpanel:track', mixpanel.track);	// Passes through event to mixpanel.track function https://mixpanel.com/help/reference/javascript#sending-events
		eventbus.on('mixpanel:people:set', people);

		// Mixpanel is initiated successfully
		eventbus.emit('mixpanel:init', true);
	} else {
		// Mixpanel is not initiated
		eventbus.emit('mixpanel:init', false);
	}
};

function people(username, parameters) {
	// Passes through event to mixpanel.people.set function https://mixpanel.com/help/reference/javascript#storing-user-profiles
	// Wrapper for people.set because it blows up if we try to pass it directly above
	mixpanel.people.set(username, parameters);
}
module.exports = {
	start: start
};
