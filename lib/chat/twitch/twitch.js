/* twitch.js - Wrap Twitch (tmi) in a basic event system */

// Initialize connection to Twitch
var eventbus;

var client;
var channel;
var live = false;
var clientID;
var chattersUrl;
var pollrate;

var start = function start(_eventbus, tmiClient, tmiChannel, tmiClientID) {
	eventbus = _eventbus;
	client = tmiClient;
	channel = tmiChannel;	// We'll need to reference the active channel
	clientID = tmiClientID;

	// Initialize event listeners
	listenToChat();
	listenToWhisper();
	listenToEventbusSay();
	listenToEventbusWhisper();
	listenToSubscription();

	// Get URL for current channel so we can listen for join's
	// pollrate = 5000;	// Poll every 5s for testing
	pollrate = 15000;	// Poll every 15s
	chattersUrl = "https://tmi.twitch.tv/group/user/" + channel.substr(1) + "/chatters";	// Undocumented URL to grab list of current members in channel
	streamUrl = "https://api.twitch.tv/";

	client.once('roomstate', function(channel, state) {
		// We've now joined the channel, poll away!
		getActiveUsers();	// Poll immediately then start a timer every few seconds
		setInterval(getActiveUsers, pollrate);
		setInterval(isStreaming, pollrate);
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

var listenToSubscription = function() {
	/* User subscribed to the channel */
	client.on('subscription', function (channel, username) {
		eventbus.emit('user:subscribe', username);
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
		if(body) {
			var chatters = body.chatters;
			if(chatters) {
				// Chatters Object:
				//  { moderators: [ 'hpc_dumbledore' ],
		    //			staff: [],
		    //			admins: [],
		    //			global_mods: [],
		    //			viewers: [] }

				users = users.concat(chatters.moderators, chatters.staff, chatters.admins, chatters.global_mods, chatters.viewers);	// Combine viewer types into a single array

				eventbus.emit('twitch:users', users);
			}			
		}
	});
};

var isStreaming = function() {
	/* Call from a setinterval to regularly poll twitch for users */
	client.api({
		url: 'https://api.twitch.tv/kraken/streams/' + channel.substr(1),
		headers: {
			'Client-ID': clientID
		}
	}, function(err, res, body) {
		if(!err) {
			if(body.stream) {
				if(body.stream.stream_type == 'live') {
					live = true;
				} else {
					live = false;
				}
			}
			else {
				live = false;
			}
		}
	});
}

function isLive() {
	return(live);
}

module.exports = {
	start: start,
	isLive: isLive
};
