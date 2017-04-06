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
			case 'commends':
				getCommends(username, parameters);
			default:
		}
	});

	eventbus.on('chat:whispercommand', function(username, command, parameters) {
		switch(command) {
			case 'setcommends':
				setCommends(username, parameters);
				break;
			default:
		}
	});
};

var sortingHat = function sortingHat(username) {
	// !sortinghat - requires username
	eventbus.emit('user:sort', username);
};

var rules = function rules(parameters) {
	var response = [];

	var response = getRules(parameters);

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
	// Take parameters and spit out the rules
	// (empty): Display rules 1-3
	// #5: Display random rule from 4-end

	var response = [];

	if(parameters) {
		var text = stripInput(parameters);
		var numberOfRules = strings.rules.rule.length;

		if(text> 0 && text < 4) {
			// Return the actual rule
			response.push(strings.rules.rule[text]);
			return(response);
		}
		else if(text >= 4 && text < numberOfRules)
		{
			// Return a random rule between 4-end
			// Number of rules = 7
			// +4
			var randomRules = numberOfRules-5;	// There are 3 base rules (and array math)
			var ruleNumber = Math.round(Math.random()*randomRules)+4;

			response.push(strings.rules.rule[ruleNumber]);

			return(response);
		}
		else {
			return(null);
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

var stripInput = function stripInput(text) {
	if(text.length == 2 && text[0] == "#") {
		// Strip # from the start of rules
		text = text.substr(1);
	}
	
	if(text.length == 1) {
		// Make sure the parameter isn't longer than 1 digit
		if(text >= 0 && text <= strings.rules.rule.length-1) {
			return(text);
		}
		else {
			// Input isn't a valid rule number
			return(null);
		}
	}
	else {
		// Param is multiple digits
		return(null);
	}
}

var setCommends = function setCommends(username, commends) {
	if(commends) {
		eventbus.emit('user:setcommends', username, commends);
	}
	else {
		// No parameters passed in
		eventbus.emit('error:issue', 'No parameters passed in');
	}
}

var getCommends = function getCommends(username, parameters) {
	if(parameters) {
		// Looking up another user
		eventbus.emit('user:getcommends', parameters);
	}
	else {
		eventbus.emit('user:getcommends', username);
	}
}


module.exports = {
	start: start
};