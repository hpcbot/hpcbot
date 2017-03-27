/* App.js - Main app file for hpc-bot */

require('dotenv').config();	// Load environment variables from .env

var eventbus = require('./lib/eventbus'); // Global event bus that modules can pub/sub to

// Initialize Twitch connection
var Twitch = require('./lib/twitch');
var twitch = Twitch.start();

var Chat = require ('./lib/chat');


eventbus.on('twitch:chat', function(channel, userstate, message, self) {
	console.log(message);
});

// var strings = require('./config/strings.json');

// var Chat = require('./lib/chat');
// var Users = require('./lib/user');
// var db = require('./lib/db');


// var client = new tmi.client(config.options);
// var channel = config.options.channels[0];	// We'll need to reference the active channel

// db.connect();
/*
client.connect();

/* User said something in the channel */
// client.on('chat', function (channel, userstate, message, self) {
	// Check if chat line was a command
	// Chat.command(userstate, message, self, function(response) {
		// if(response) {
			// response.forEach(function(line) {
				// Handle multi-line responses
				// client.say(channel, line);
			// });
		// }
	// });
// });

/* User sent a private message */
// client.on('whisper', function (from, userstate, message, self) {
	// Check if message was a command
	// Chat.command(userstate, message, self, function(response) {
		// if(response) {
			// client.whisper(from, response);	
		// }
	// });
// });

// client.on('join', function (channel, userstate, self) {
	// var username = userstate;	// For some reason in this context, the userstate has no additional info

	// Hack to rule out bots or brokenness
	// if(username != 'undefined' || username != 'hpc_dumbledore' || username != 'moobot') {
		
		// Create a user if one doesn't exist
		// Users.add(username, function(err, username) {
			// if(!err) {
				// This is a new user
				// var response = strings.join.welcome + username + strings.join.new_here;
				// client.say(channel, response);
			// }
		// });
	// }	
// });