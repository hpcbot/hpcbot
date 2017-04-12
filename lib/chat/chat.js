/* chat.js - Basic chat functions for bot
   * Parse chat messages
   * Interpret and respond to commands */

var strings = require('../../config/strings.json');

var eventbus;
var mixpanel;	// Logging library

var start = function start(_eventbus, _mixpanel) {
	eventbus = _eventbus;
	mixpanel = _mixpanel;

	listenToTwitchChat();
	listenToTwitchWhisper();
};

var listenToTwitchChat = function() {
	/* User said something in the channel 
	Input: #harrpotterclan, 'bdickason', '!house teamalea', false
	Output: username, command, parameters */
	eventbus.on('chat:parse', function(userstate, message, self) {
		parse(userstate, message, self, function(err, username, command, parameters) {
			if(!err) {
				switch(command) {
					case 'commends':
						eventbus.emit('commends:get', username, parameters);
						mixpanel.track('commends:get', {
							distinct_id: username,
							parameters: parameters
						});
						break;
					case 'house':
						eventbus.emit('house:get', username, parameters);
						mixpanel.track('house:get', {
							distinct_id: username,
							parameters: parameters
						});
						break;
					case 'rules':
					case 'rule':
						eventbus.emit('rules:get', parameters);
						mixpanel.track('rules:get', {
							distinct_id: username,
							parameters: parameters
						});

						break;
					case 'sortinghat':
						eventbus.emit('house:set', username);
						// Logged in house so we can get their actual house

					default:
						break;
				}
			}
		});
	});
};

var listenToTwitchWhisper = function() {
	/* User whispered something to the bot
	Input: 'teamalea', 'bdickason', '!commends 5360', false
	Output: username, command, parameters */
	eventbus.on('chat:parsewhisper', function(userstate, message, self) {
		parse(userstate, message, self, function(err, username, command, parameters) {
			if(!err) {
				switch(command) {
					case 'setcommends':
						eventbus.emit('commends:set', username, parameters);
						mixpanel.track('commends:get', {
							distinct_id: username,
							parameters: parameters
						});

					break;
				}
			}
		});
	});
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

module.exports = {
	start: start
};
