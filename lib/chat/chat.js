/* chat.js - Basic chat functions for bot
   * Parse chat messages
   * Interpret and respond to commands */

var strings = require('../../config/strings.json');
var whitelist = require('../../config/whitelist.json');

var eventbus;
var mixpanel;	// Logging library

var triggers;  // List of chat triggers that have been loaded

var start = function start(_eventbus, _mixpanel) {
	eventbus = _eventbus;
	mixpanel = _mixpanel;

	triggers = [];

	listenToTwitchChat();
};

var addTriggers = function(options) {
	/* addTrigger - Instructs the bot to listen to a trigger (or multiple triggers) and fire an event if one hits
	options - accepts an object or array of multiple objects
	* options.name- the trigger word to listen for (e.g. powermove) -- do not include the '!'
	* options.type - are we listening via whisper or chat?
	* options.whitelist - does this user have to be whitelisted?
	* options.event - what event should we fire when the event is called */
	// Add the trigger(s) so the chat parser knows to fire an event if conditions are mental

	var trigger = {};

	if(Array.isArray(options)) {
		// Support multiple options via an array
		options.forEach(function(trigger) {
			triggers.push(trigger);
		});

	}
	else {
		if(!options.name) {
			// We have to have a trigger command, otherwise we listen for.. everything? :X
			throw new Error('You must specify a trigger to listen for.');
		}
		else {
			// We have a command, grab the options and store them
				trigger.name = options.name;
				trigger.type = options.type ? options.type : 'chat';
				trigger.whitelist = options.whitelist ? options.whitelist : false;
				trigger.event = options.event ? options.event : null;

				// Now add it to the list of active commands
				triggers.push(trigger);
		}
	}
}

var listenToTwitchChat = function() {
	/* User said something in the channel
	Input: #harrypotterclan, 'bdickason', '!house teamalea', 'chat', false
	Output: error, username, trigger, type, parameters */
	eventbus.on('chat:parse', function(userstate, message, type, self) {
		parse(userstate, message, self, function(err, username, name, parameters) {
			if(!err) {
				// Parse through commands and look for a match with the trigger word
				var matches = triggers.filter(function(elem, i, trigger) {
					if(type == trigger[i].type) {
						return trigger[i].name == name;
					}
				});

				// For each match, emit an event and log the event
				matches.forEach(function(match) {

					// Check if command requires that we check the whitelist
					if(!match.whitelist || (match.whitelist && isMod(username))) {
						eventbus.emit(match.event, username, parameters);
						// mixpanel.track(match.event, {	// TODO Convert mixpanel to a module tha takes events like 'mxipane:track'
						// 	distinct_id: username,
						// 	channel: 'whisper'
						// });
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
	if(whitelist.includes(username)) {
		return(true);
	}
	else {
		return(false);
	}
}

module.exports = {
	start: start,
	isMod: isMod,
	addTriggers: addTriggers
};
