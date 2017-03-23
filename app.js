/* App.js - Main app file for hpc-bot */

require('dotenv').config();	// Load environment variables from .env

var tmi = require("tmi.js");
var config = require("./config/tmi-options.js");
var chat = require('./lib/chat.js');

var client = new tmi.client(config.options);
var channel = config.options.channels[0];	// We'll need to reference the active channel

client.connect();

client.on('chat', function (channel, userstate, message, self) {
	chat.command(userstate, message, self, function(response) {
		if(response) {
			client.say(channel, response);	
		}
	});
});

