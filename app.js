/* App.js - Main app file for hpc-bot */

require('dotenv').config();	// Load environment variables from .env

var eventbus = require('./lib/eventbus'); // Global event bus that modules can pub/sub to

// Initialize Twitch connection
var Twitch = require('./lib/twitch');
var twitch = Twitch.start();

var Chat = require ('./lib/chat');
var chat = Chat.start();

var Commands = require ('./lib/commands');
var commands = Commands.start();

var db = require('./lib/db');
db.connect();

var User = require ('./lib/user');
var user = User.start(db);


// client.on('join', function (channel, userstate, self) {
	// var username = userstate;	// For some reason in this context, the userstate has no additional info

	// Hack to rule out bots or brokenness
	// if(username != 'undefined' || username != 'hpc_dumbledore' || username != 'moobot') {
		
		// Create a user if one doesn't exist
		// Users.add(username, function(err, username) {
			// if(!err) {
				// This is a new user
				// var response = strings.join.welcome + username + strings.join.new_here;
				// client.say(channel, response);
			// }
		// });
	// }	
// });