#!/usr/bin/env node
/* App.js - Main app file for hpc-bot */

require('dotenv').config();	// Load environment variables from .env

var eventbus = require('./lib/eventbus'); // Global event bus that modules can pub/sub to

// Initialize Twitch connection
var tmi = require("tmi.js");	// Initialize tmi.js here so we can inject it during testing
var twitchConfig = require("./lib/twitch/config/tmi-options.js");
var twitchClient = new tmi.client(twitchConfig.options);
twitchClient.connect();

// Initialize Mixpanel for logging
var Mixpanel = require('mixpanel');
var mixpanelConfig = require('./config/mixpanel-options.js');

var mixpanel;
if(mixpanelConfig.options) {
	mixpanel = Mixpanel.init(mixpanelConfig.options);
}
mixpanel.channel = twitchConfig.options.channels[0];

var Twitch = require('./lib/twitch');
Twitch.start(eventbus, twitchClient, twitchConfig.options.channels[0]);

// Load Models
var db = require('./lib/db');
db.connect();

var User = require('./lib/models/user');
User.start(db, mixpanel);

// Bot modules
var Chat = require ('./lib/chat');
Chat.start(eventbus, mixpanel);

var Overlays = require('twitch-overlay');
// // var Overlays = require('../twitch-overlay');
Overlays.start({events: eventbus});

/* Setup Bot Commands */
var commands = [];

// Message on Join
var Join = require('./lib/commands/join');
Join.start(eventbus, User);
commands.push(Join);

// !setcommends / !commends
var Commends = require('./lib/commands/commends');
Commends.start(eventbus, User);
commands.push(Commends);

// !rules
var Rules = require('./lib/commands/rules');
Rules.start(eventbus);
commands.push(Rules);

// !house / !sortinghat
var House = require('./lib/commands/house');
House.start(eventbus, User);
commands.push(House);

// !status
var Status = require('./lib/commands/status');
Status.start(eventbus, User);
commands.push(Status);

// !powermove
var Powermove = require('./lib/commands/powermove');
Powermove.start(eventbus);
commands.push(Powermove);

// !2rnb
var TwoRax = require('./lib/commands/tworax');
TwoRax.start(eventbus);
commands.push(TwoRax);

// !text
var Text = require('twitch-overlay-text');
Text.start(eventbus);
commands.push(Text);

// !hpcwins
var Hpcwins = require('./lib/commands/hpcwins');
Hpcwins.start(eventbus);
commands.push(Hpcwins);

/* Load chat triggers and stream overlays */
commands.forEach(function(command) {
	// Start listening for chat triggers

	if(command.triggers && (command.triggers.length > 0)) {
		Chat.addTriggers(command.triggers);
	}

	// Initialize individual overlays
	if(command.overlay) {
		Overlays.add(command.overlay);
	}
});



//
// var _options = {
// 	"name": "powermove",
// 	"event": "stream:powermove",
// 	"type": "video",
// 	"video": "commands/powermove/static/video/powermove.mp4",
// 	"view": "video.pug"	// Optional - inferred from type: video
// }
// var Powermove = new Overlays.overlay(_options);
// Overlays.add(Powermove);

//
// Overlays.add(House.overlay);
// Overlays.add(Powermove.overlay);
// Overlays.add(TwoRax.overlay);
// Overlays.add(Text.overlay);
// Overlays.add(Hpcwins.overlay);
