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

			// Remove the '!' from the start
			message = message.substr(1);

			// Break out the command from the message
			var command = message.split(" ")[0];
			command = command.toLowerCase();

			// Split out the text from the message
			var text = message.substr(command.length-1);

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