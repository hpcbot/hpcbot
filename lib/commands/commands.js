/* commands.js - Map the right commands and parameters to other modules
*/

var strings = require('../../config/strings.json');
var eventbus; // Global event bus that modules can pub/sub to

var start = function start(_eventbus) {
	eventbus = _eventbus;
	listenToChat();
};

var listenToChat = function() {
	/* User said something in the channel 
	Input: username, line of text
	Output: depends on the command */
	eventbus.on('chat:command', function(username, command, parameters) {
		switch(command) {
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