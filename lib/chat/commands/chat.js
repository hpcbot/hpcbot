/* commands.js - Basic chat functions for bot
   * Parse chat messages
   * Interpret and respond to commands

	 To add commands:
	     var command = {
	       name: 'gold',                 // What is the !command that you want to listen for?
	       type: 'whisper',              // Is this command triggered via chat or whisper?
	       whitelist: true,              // (Optional) check permissions against a whitelist of usernames
	       event: 'overlay:gold:show'    // (Optional) Fire a custom event (default: 'commands:gold')
	     };
	     bot.commands.add(command); */
var extend = require('extend');

var eventbus;

var commands;  // List of chat commands that have been loaded

var options = {
	whitelist: [],		// List of usernames to whitelist for whisper comamnds
	events: null		// Listens to events to trigger commands
}

var start = function start(_options) {
	// Options for starting chat commands
	options = extend(options, _options);    // Copy _options into options, overwriting defaults

	commands = [];

	listenToTwitchChat();
};

var add = function(options) {
	/* add - Instructs the bot to listen to a command (or multiple commands) and fire an event if one hits
	options - accepts an object or array of multiple objects
	* options.name- the command word to listen for (e.g. powermove) -- do not include the '!'
	* options.type - are we listening via whisper or chat?
	* options.whitelist - does this user have to be whitelisted?
	* options.event - what event should we fire when the event is called */
	// Add the command(s) so the chat parser knows to fire an event if conditions are mental

	var command = {};

	if(Array.isArray(options)) {
		// Support multiple options via an array
		options.forEach(function(command) {
			commands.push(command);
		});
	}
	else {
		if(!options.name) {
			// We have to have a command command, otherwise we listen for.. everything? :X
			throw new Error('You must specify a command to listen for.');
		}
		else {
			// We have a command, grab the options and store them
				command.name = options.name;
				command.type = options.type ? options.type : 'chat';
				command.whitelist = options.whitelist ? options.whitelist : false;
				command.event = options.event ? options.event : 'command:' + options.name;

				// Now add it to the list of active commands
				commands.push(command);
		}
	}
}

var listenToTwitchChat = function() {
	/* User said something in the channel
	Input: #harrypotterclan, 'bdickason', '!house teamalea', 'chat', false
	Output: error, username, command, type, parameters */

	options.events.on('chat:parse', function(userstate, message, type, self) {
		parse(userstate, message, self, function(err, username, name, parameters) {
			if(!err) {
				// Parse through commands and look for a match with the command word
				var matches = commands.filter(function(elem, i, command) {
					if(type == command[i].type) {
						return command[i].name == name;
					}
				});

				// For each match, emit an event and log the event
				matches.forEach(function(match) {

					// Check if command requires that we check the whitelist
					if(!match.whitelist || (match.whitelist && isMod(username))) {
						options.events.emit(match.event, username, parameters);
						options.events.emit('mixpanel:track', match.event, {
							distinct_id: username,
							channel: 'whisper'
						});
					}
				});
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

var isMod = function isMod(username) {
	// Determines whether or not the user has admin access to the bot
	// Hack because we can't easily pull mod status during whisper state
	if(options.whitelist.includes(username)) {
		return(true);
	}
	else {
		return(false);
	}
}

var list = function() {
  // Returns the currently loaded commands
  return(commands);
}

var clear = function() {
  commands = [];
}

module.exports = {
	start: start,
	isMod: isMod,
	add: add,
	list: list,
	clear: clear
};
