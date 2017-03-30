/* twitch.js - Wrap Twitch (tmi) in a basic event system */

// Initialize connection to Twitch
var tmi = require("tmi.js");
var config = require("./config/tmi-options.js");
var eventbus = require('../eventbus');

var client;
var channel;

var start = function start() {
	client = new tmi.client(config.options);
	channel = config.options.channels[0];	// We'll need to reference the active channel
	client.connect();	// Connect to twitch chat

	// Initialize event listeners
	listenToChat();
	listenToJoin();
	listenToEventbusSay();
};

var listenToChat = function() {
	/* User said something in the channel */
	client.on('chat', function (channel, userstate, message, self) {
		eventbus.emit('twitch:chat', channel, userstate, message, self);
	});
};

var listenToJoin = function() {
	/* User joined the channel */
	client.on('join', function (channel, userstate, self) {
		eventbus.emit('user:join', channel, userstate, self);
	});
};

var listenToEventbusSay = function() {
	/* Make the bot say something */
	eventbus.on('twitch:say', function (response) {
		if(response) {
			response.forEach(function(line) {
				// Handle single or multi-line responses
				client.say(channel, line).then(function(data) {
    				// console.log(data);
				}).catch(function(err) {
    				console.log(err);
				});;
			});
		}
	});
}

module.exports = {
	start: start
};

