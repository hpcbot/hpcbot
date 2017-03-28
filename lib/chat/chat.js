/* chat.js - Basic chat functions for bot
   * Parse chat messages
   * Interpret and respond to commands */

var eventbus = require('../eventbus'); // Global event bus that modules can pub/sub to
var strings = require('../../config/strings.json');

var start = function start() {
	listenToTwitchChat();
	listenToUserSorted();
};

var listenToTwitchChat = function() {
	/* User said something in the channel 
	Input: #harrpotterclan, 'bdickason', '!house teamalea', false
	Output: username, command, parameters */
	eventbus.on('twitch:chat', function(channel, userstate, message, self) {
		parse(userstate, message, self, function(err, username, command, parameters) {
			if(!err) {
				eventbus.emit('chat:command', username, command, parameters);
			}
		});
	});
};

var listenToUserSorted = function() {
	/* User was Sorted
	Input: err, username, house
	Output: username, command, parameters */
	eventbus.on('chat:sorted', function(err, username, house) {
		var response = [];
		if(!err) {
			// User successfully sorted
			line = username + strings.house.proud_member_of + house;
			response.push(line);
			eventbus.emit('twitch:say', response);
		}
	});
}

module.exports = {
	start: start
};

var parse = function parse(userstate, message, self, callback) {
	var username;
	var command;
	var parameters;

	// Grab username
	username = getUsername(userstate);

	// Parse a line of chat
	message = message.toLowerCase();	// Convert all commands to lowercase

	// Ignore my own messages - Remove this once done testing
	if(self) {
		callback(null);
	}

	// Check if this is a command
	if(message.substr(0, 1) == "!") {
		var command;
		var parameters;
		// Remove the '!' from the start
		message = message.substr(1);

		// Break out the command from the message
		command = message.split(" ")[0];

		// Check if there is text appended
		if(message.length > command.length) {
			// Split out the text from the message
			parameters = message.substr(command.length+1);	
		}
		callback(null, username, command, parameters);
	}
	else {
		// This isn't a command 
		callback("This isn't a command", null, null, null);
	}


};

var getUsername = function(userstate) {
	var username;
	if(userstate.username) {
		// Object was passed in
		username = userstate.username;
	}
	else {
		// String was passed in
		username = userstate;
	}

	return(username);
}