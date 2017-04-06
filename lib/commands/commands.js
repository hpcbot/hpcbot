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
				eventbus.emit('rules:get', parameters);
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