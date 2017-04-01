/* commands.js - Map the right commands and parameters to other modules
*/

var eventbus = require('../eventbus'); // Global event bus that modules can pub/sub to
var strings = require('../../config/strings.json');

var start = function start() {
	listenToChat();
};

var listenToChat = function() {
	/* User said something in the channel 
	Input: username, line of text
	Output: depends on the command */
	eventbus.on('chat:command', function(username, command, parameters) {
		switch(command) {
			case 'sortinghat':
				sortingHat(username);
				break;
			case 'rules':
			case 'rule':
				rules(parameters);
				break;
			case 'house':
				house(username, parameters);
				break;
			default:
		}
		

	});
};

module.exports = {
	start: start
};

var sortingHat = function sortingHat(username) {
	// !sortinghat - requires username
	eventbus.emit('user:sort', username);
};

var rules = function rules(parameters) {
	var response = [];

	var response = getRules(parameters);
	console.log(response);
	if(response) {
		eventbus.emit('twitch:say', response);
	}
};

var house = function house(username, parameters) {
	if(parameters) {
		// User is looking for someone else's house
		eventbus.emit('user:house', parameters);
	}
	else {
		// User is looking for their own house
		eventbus.emit('user:house', username);
	}
};

var getRules = function getRules(parameters) {
	var response = [];
	if(parameters) {
		var text = parameters;
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
				console.log(response);
				return(response);
			}
		}
	}
	else {
		// User needs to know the basics
		response.push(strings.rules.overview);
		response.push(strings.rules.rule[1]);
		response.push(strings.rules.rule[2]);
		response.push(strings.rules.rule[3]);
		return(response);
	}
};