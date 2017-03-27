/* chat.js - Basic chat functions for bot
   * Parse chat messages
   * Interpret and respond to commands */

var eventbus = require('../eventbus'); // Global event bus that modules can pub/sub to

var Users = require('../user/user');
var strings = require('../../config/strings.json');

var start = function start() {
	listenToChat();
};

var listenToChat = function() {
	/* User said something in the channel 
	Input: username, line of text
	Output: username, command, parameters */
	eventbus.on('twitch:chat', function(channel, userstate, message, self) {
		parse(userstate, message, self, function(err, username, command, parameters) {
			if(!err) {
				eventbus.emit('chat:command', username, command, parameters);
			}
		});
	});
};

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
/*
	// Parse a line of chat, see if it's a command, and respond (if necessary)
	command: function(userstate, message, self, callback) {
		var response = [];
		message = message.toLowerCase();	// Convert all commands to lowercase

		// Ignore my own messages - Remove this once done testing
		if(self) {
			callback(null);
		}

		// Check if this is a command
		if(message.substr(0, 1) == "!") {
			var command;
			var text;
			// Remove the '!' from the start
			message = message.substr(1);

			// Break out the command from the message
			command = message.split(" ")[0];

			// Check if there is text appended
			if(message.length > command.length) {
				// Split out the text from the message
				text = message.substr(command.length+1);	
			}

			switch(command) {
				case 'sortinghat':
					Users.sorting(userstate, function(error, house) {
						if(error == 'sorted') {
							// User has already been sorted
							response.push(strings.sorting.user_already_sorted);
							callback(response);
						}
						else {
							var line = strings.congratulations + userstate.username + strings.general.exclamation + strings.sorting.joined + house + strings.general.exclamation;
							response.push(line);
							callback(response);
						}
					});
					break;
				case 'rules':
				case 'rule':
					if(text) {
						// User wants a specific rule
						if(text.length == 2 && text[0] == "#") {
							// Strip # from the start of rules
							text = text.substr(1);
						}
						
						if(text.length == 1) {
							// Make sure the parameter isn't longer than 1 digit
							if(text >= 0 && text <= strings.rules.rule.length-1) {
								// Make sure the parameter fits within our number of rules
								response.push(strings.rules.rule[text]);
								callback(response);

							}
							else {
								// Ignore extra text
								callback(null);
							}
						}
						else {
							// Ignore extra text
							callback(null);
						}
					}
					else {
						// Show the basics
						response.push(strings.rules.overview);
						response.push(strings.rules.rule[1]);
						response.push(strings.rules.rule[2]);
						response.push(strings.rules.rule[3]);
						callback(response);
					}
					break;
					case 'house':
						var username = userstate.username;	// Default to listing your own house
						var line;

						if(text) {
							// Look up a specific user's house
							username = text;
						}
						Users.house(username, function(err, house) {
							if(err == "User not found") {
								line = strings.house.cannot_find + username;
							}
							else {
								// User exists, look up their house
								if(house && house != "muggle") {
									line = username + strings.house.proud_member_of + house;
								}
								else {
									line = username + strings.house.muggle;
								}
							}
							response.push(line);
							callback(response);
						});
						break;
				default:
					callback(response);
			}			
		}
	}

	
};
*/