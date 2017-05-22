/* twitch.js - Wrap Twitch (tmi) in a basic event system */

// Initialize connection to Twitch
var eventbus;

var client;
var channel;
var chattersUrl;
var pollrate;

var start = function start(_eventbus, tmiClient, tmiChannel) {
	eventbus = _eventbus;
	client = tmiClient;
	channel = tmiChannel;	// We'll need to reference the active channel

	// Initialize event listeners
	listenToChat();
	listenToWhisper();
	listenToJoin();
	listenToEventbusSay();
	listenToEventbusWhisper();

	// Get URL for current channel so we can listen for join's
	pollrate = 20000;	// Poll every 20s
	chattersUrl = "https://tmi.twitch.tv/group/user/" + channel.substr(1) + "/chatters";	// Undocumented URL to grab list of current members in channel

	client.once('roomstate', function(channel, state) {
		// We've now joined the channel, poll away!
		getActiveUsers();	// Poll immediately then start a timer every few seconds
		setInterval(getActiveUsers, pollrate);
	});
};

var listenToChat = function() {
	/* User said something in the channel */
	client.on('chat', function (channel, userstate, message, self) {
		eventbus.emit('chat:parse', userstate, message, 'chat', self);
	});
};

var listenToWhisper = function() {
	/* User whispered (messaged) the bot */
	client.on('whisper', function (from, userstate, message, self) {
		eventbus.emit('chat:parse', userstate, message, 'whisper', self);
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
				client.say(channel, line);

				/*.then(function(data) {
				//}).catch(function(err) {
    			//	console.log(err);
				// });; */
			});
		}
	});
};

var listenToEventbusWhisper = function() {
	/* Make the bot whisper something */
	eventbus.on('twitch:whisper', function (username, response) {

	if(response) {
		response.forEach(function(line) {
			// Handle single or multi-line responses
			client.whisper(username, line);

			/*.then(function(data) {
			}).catch(function(err) {
  				console.log(err);
			});; */
			});
		}
	});
};

var getActiveUsers = function() {
	/* Get a list of users currently in the channel and broadcast it */
	var users = [];

	client.api({
    url: chattersUrl,
	}, function(err, res, body) {

		var chatters = body.chatters;
		if(chatters) {
			// Chatters Object:
			//  { moderators: [ 'hpc_dumbledore' ],
	    //			staff: [],
	    //			admins: [],
	    //			global_mods: [],
	    //			viewers: [] }

			users = users.concat(chatters.moderators, chatters.staff, chatters.admins, chatters.global_mods, chatters.viewers);	// Combine viewer types into a single array
			console.log(users);
			eventbus.emit('twitch:users', users);
		}
	});
};

var pollTwitchUsers = function() {
	/* Call from a setinterval to regularly poll twitch for users */

}
module.exports = {
	start: start
};
