/* chat.js - Basic chat functions for bot
   * Parse messages
   * Interpret and resepond to commands */

var Users = require('./user.js');
var strings = require('../config/strings.json');

module.exports = {
	// Parse a line of chat, see if it's a command, and respond (if necessary)
	command: function(userstate, message, self, callback) {
		var response;

		// Ignore my own messages - Remove this once done testing
		if(self) {
			console.log("Error");
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
							response = strings.sorting.user_already_sorted;
							callback(response);
						}
						else {
							response = strings.congratulations + userstate.username + strings.general.exclamation + strings.sorting.joined + house + exclamation;
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
								response = strings.rules.rule[text];
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
						var response = strings.rules.overview + strings.general.newline;
						response += strings.rules.rule[1] + strings.general.newline;
						response += strings.rules.rule[2] + strings.general.newline;
						response += strings.rules.rule[3] + strings.general.newline;
						callback(response);
					}
					break;
				default:
					callback(response);
			}			
		}
	}
};
