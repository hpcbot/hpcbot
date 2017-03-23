/* chat.js - Basic chat functions for bot
   * Parse messages
   * Interpret and resepond to commands */

module.exports = {
	// Parse a line of chat, see if it's a command, and respond (if necessary)
	command: function(userstate, message, self, callback) {
		var response;

		// Ignore my own messages - Remove this once done testing
		if(self) callback(null);

		// Check if this is a command
		if(message.substr(0, 1) == "!") {
			// Split command and message text
			var spacePosition = message.indexOf(' ');
			var command = message.substr(1, spacePosition-1);	// Remove the '!' at the start and the space
			var text = message.substr(spacePosition);
			
			console.log(spacePosition);

			switch(command) {
				case 'sortinghat':
					response = userstate.username + " is a muggle!";
					break;
			}

			console.log("Command: " + command);
			console.log("Text: " + text);

			callback(response);
		}
	}
};