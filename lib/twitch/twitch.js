/* twitch.js - Wrap Twitch (tmi) in a basic event system */

// Initialize connection to Twitch
var eventbus;

var client;
var channel;

var start = function start(_eventbus, tmiClient, tmiChannel) {
	eventbus = _eventbus;
	client = tmiClient;
	channel = tmiChannel;	// We'll need to reference the active channel

	// Initialize event listeners
	listenToChat();
	listenToJoin();
	listenToEventbusSay();
	listenToWhisper();
};

var listenToChat = function() {
	/* User said something in the channel */
	client.on('chat', function (channel, userstate, message, self) {
		eventbus.emit('chat:parse', userstate, message, self);
	});
};

var listenToWhisper = function() {
	/* User whispered (messaged) the bot */
	client.on('whisper', function (from, userstate, message, self) {
		eventbus.emit('chat:parsewhisper', userstate, message, self);
	});
};

var listenToJoin = function() {
	/* User joined the channel */
	client.on('join', function (channel, userstate, self) {
		eventbus.emit('user:join', userstate);
	});
};

var listenToEventbusSay = function() {
	/* Make the bot say something */
	eventbus.on('twitch:say', function (response) {
		if(response) {
			response.forEach(function(line) {
				// Handle single or multi-line responses
				client.say(channel, line).then(function(data) {
				}).catch(function(err) {
    				console.log(err);
				});;
			});
		}
	});
}

var listenToEventbusWhisper = function() {
	/* Make the bot whisper something */
	eventbus.on('twitch:whisper', function (username, response) {
		if(response) {
			response.forEach(function(line) {
				// Handle single or multi-line responses
				client.whisper(username, line).then(function(data) {
				}).catch(function(err) {
    				console.log(err);
				});;
			});
		}
	});
}

module.exports = {
	start: start
};

