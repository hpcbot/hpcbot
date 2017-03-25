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
		if(self) callback(null);

		// Check if this is a command
		if(message.substr(0, 1) == "!") {

			// Remove the '!' from the start
			message = message.substr(1);

			// Break out the command from the message
			var command = message.split(" ")[0];
			command = command.toLowerCase();

			// Split out the text from the message
			var text = message.substr(command.length-1);

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
				default:
					callback(response);
			}			
		}
	}
};
