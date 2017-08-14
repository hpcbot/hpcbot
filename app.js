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

var Channel = require('./lib/models/channel');
Channel.start(db, eventbus);

// Bot modules
var Chat = require ('./lib/chat');
Chat.start(eventbus, mixpanel);

var Overlays = require('twitch-overlay');
// var Overlays = require('../twitch-overlay');
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

// !dice / !coin
var Random = require('./lib/commands/random');
Random.start(eventbus);
commands.push(Random);


// Add video overlay commands
var videoOverlay = require('twitch-overlay-video');
// var videoOverlay = require('../twitch-overlay-video');

// !powermove
var Powermove = new videoOverlay({
	trigger: "powermove",
	eventbus: eventbus,
	video: "lib/commands/powermove/static/video/powermove.mp4"
});
commands.push(Powermove);

// !2rnb
var Tworax = new videoOverlay({
	trigger: "tworax",
	eventbus: eventbus,
	video: "lib/commands/tworax/static/video/tworax.mp4"
});
commands.push(Tworax);

// !hpcwins
var Hpcwins = new videoOverlay({
	trigger: "hpcwins",
	eventbus: eventbus,
	video: "lib/commands/hpcwins/static/video/hpcwins.mp4"
});
commands.push(Hpcwins);

// !gift
var Gift = new videoOverlay({
	trigger: "gift",
	eventbus: eventbus,
	video: "lib/commands/gift/static/video/gift.mp4"
});
commands.push(Gift);

// !cheese
var Cheese = new videoOverlay({
	trigger: "cheese",
	eventbus: eventbus,
	video: "lib/commands/cheese/static/video/cheese.mp4"
});
commands.push(Cheese);

// !smoke
var Smoke = new videoOverlay({
	trigger: "smoke",
	eventbus: eventbus,
	video: "lib/commands/smoke/static/video/smokegank.mp4"
});
commands.push(Smoke);

// !kia
var Kia = new videoOverlay({
	trigger: "kia",
	eventbus: eventbus,
	video: "lib/commands/kia/static/video/kia.mp4"
});
commands.push(Kia);

// !monster
var Monster = new videoOverlay({
	trigger: "monster",
	eventbus: eventbus,
	video: "lib/commands/monster/static/video/monster.mp4"
});
commands.push(Monster);

// !muggle
var Muggle = new videoOverlay({
	trigger: "muggle",
	eventbus: eventbus,
	video: "lib/commands/muggle/static/video/muggle.mp4"
});
commands.push(Muggle);

// !sac
var Sacrifice = new videoOverlay({
	trigger: "sac",
	eventbus: eventbus,
	video: "lib/commands/sacrifice/static/video/sacrifice.mp4"
});
commands.push(Sacrifice);


// !text (External module)
var Text = require('twitch-overlay-text');
// var Text = require('../twitch-overlay-text');
Text.start(eventbus);
commands.push(Text);

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
