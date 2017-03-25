/* chat.js - Basic chat functions for bot
   * Parse messages
   * Interpret and resepond to commands */

var Users = require('./user.js');
var strings = require('../config/strings.json');

module.exports = {
	// Parse a line of chat, see if it's a command, and respond (if necessary)
	command: function(userstate, message, self, callback) {
		var response = [];

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
			command = command.toLowerCase();

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
				default:
					callback(response);
			}			
		}
	}
};
