/* subscribe.js - Listen to a user subscribing to the channel and play an overlay
*/

var strings = require('../../../config/strings.json');

var eventbus; // Global event bus that modules can pub/sub to

var start = function start(_eventbus) {
	eventbus = _eventbus;

	eventbus.on('user:subscribe', subscription);
};

var subscription = function subscription(username) {
	if(username) {
		console.log('gothere');
		eventbus.emit('subscription:show', username);
	}
}

module.exports = {
	start: start
};
