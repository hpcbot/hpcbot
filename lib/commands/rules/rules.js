/* rules.js - !Command to display the rules of the HPC
*/

var eventbus;	// Global event bus that modules can pub/sub to

var strings = require('../../../config/strings.json');

// Configure Chat triggers so the bot listens for this command
var triggers = [{
	name: 'rules',
	type: 'chat',
	event: 'rules:get'
}];

var start = function start(_eventbus) {
	eventbus = _eventbus;
	eventbus.on(triggers[0].event, getRules);
};

var getRules = function getRules(username, parameters) {
	// Take parameters and spit out the rules
	// (empty): Display rules 1-3
	// #5: Display random rule from 4-end

	console.log('got here');
	var response = [];

	if(parameters) {
		var text = stripInput(parameters);
		var numberOfRules = strings.rules.rule.length;
		console.log(parameters);
		console.log(text);
		if(text> 0 && text < 4) {
			// Return the actual rule
			response.push(strings.rules.number + text + strings.rules.rule[text]);
		}
		else if(text >= 4 && text < numberOfRules)
		{
			// Return a random rule between 4-end
			// Number of rules = 7
			// +4
			var randomRules = numberOfRules-5;	// There are 3 base rules (and array math)
			var ruleNumber = Math.round(Math.random()*randomRules)+4;

			response.push(strings.rules.number + text + strings.rules.rule[ruleNumber]);
		}
		else {
			return(null);
		}
	}
	else {
		// User needs to know the basics
		response.push(strings.rules.overview);
		response.push(strings.rules.number + 1 + strings.rules.rule[1]);
		response.push(strings.rules.number + 2 + strings.rules.rule[2]);
		response.push(strings.rules.number + 3 + strings.rules.rule[3]);
	}

	console.log('got here: ' + response);
	eventbus.emit('twitch:say', response);
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


module.exports = {
	start: start,
	triggers: triggers
};
