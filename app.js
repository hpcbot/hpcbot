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
Twitch.start(eventbus, twitchClient, twitchConfig.options.channels[0], twitchConfig.options.clientID);

// Load Models
var db = require('./lib/db');
db.connect();

var User = require('./lib/models/user');
User.start(db, mixpanel);

var Channel = require('./lib/models/channel');
Channel.start(db, twitchConfig.options.identity.username, eventbus, Twitch);

var Team = require('./lib/models/team');
Team.start(db, mixpanel);

var Resource = require('./lib/models/resource');
Resource.start(db, mixpanel);

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

// Goblin Gold
var Gold = require('./lib/commands/gold');
Gold.start(eventbus, Resource, Channel);
commands.push(Gold);

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

// !cup
var Housecup = require('./lib/commands/housecup');
Housecup.start(eventbus, Team);
commands.push(Housecup);

// !hween
var Halloween = require('./lib/commands/halloween');
Halloween.start(eventbus, Team);
commands.push(Halloween);


// Add video overlay commands
// var videoOverlay = require('twitch-overlay-video');
var videoOverlay = require('../twitch-overlay-video');
videoOverlay.eventbus = eventbus;


/* Events */
// !powermove
commands.push(new videoOverlay({
	trigger: "powermove",
	video: "lib/overlays/events/powermove.mp4"
}));

// !2rnb
commands.push(new videoOverlay({
	trigger: "tworax",
	video: "lib/overlays/events/tworax.mp4"
}));

// !hpcwins
commands.push(new videoOverlay({
	trigger: "hpcwins",
	video: "lib/overlays/events/hpcwins.mp4"
}));

// !gift
commands.push(new videoOverlay({
	trigger: "gift",
	video: "lib/overlays/events/gift.mp4"
}));

// !cheese
commands.push(new videoOverlay({
	trigger: "cheese",
	video: "lib/overlays/events/cheese.mp4"
}));

// !smoke
commands.push(new videoOverlay({
	trigger: "smoke",
	video: "lib/overlays/events/smokegank.mp4"
}));


// !muggle
commands.push(new videoOverlay({
	trigger: "muggle",
	video: "lib/overlays/events/muggle.mp4"
}));

// !sac
commands.push(new videoOverlay({
	trigger: "sac",
	video: "lib/overlays/events/sacrifice.mp4"
}));

// !first
commands.push(new videoOverlay({
	trigger: "first",
	video: "lib/overlays/events/Firstblood.mp4"
}));

// !Buyback
commands.push(new videoOverlay({
	trigger: "buyback",
	video: "lib/overlays/events/Buyback.mp4"
}));

// !open
// should be fullscreen
commands.push(new videoOverlay({
	trigger: "open",
	video: "lib/overlays/events/Opening.mp4"
}));

// !close
// should be fullscreen
commands.push(new videoOverlay({
	trigger: "close",
	video: "lib/overlays/events/Closing.mp4"
}));


/* Fake Ads */

// !kia
// should be fullscreen
commands.push(new videoOverlay({
	trigger: "kia",
	video: "lib/overlays/ads/kia.mp4"
}));

// !monster
// should be fullscreen
commands.push(new videoOverlay({
	trigger: "monster",
	video: "lib/overlays/ads/monster.mp4"
}));

// !polo
// should be fullscreen
commands.push(new videoOverlay({
	trigger: "polo",
	video: "lib/overlays/ads/Polo.mp4"
}));
/********************************* Halloween **********************************/

commands.push(new videoOverlay({
	trigger: "hweengwin",
	video: "lib/overlays/events/HweenGWin.mp4"
}));

commands.push(new videoOverlay({
	trigger: "hweenglose",
	video: "lib/overlays/events/HweenGLose.mp4"
}));

commands.push(new videoOverlay({
	trigger: "hweenhwin",
	video: "lib/overlays/events/HweenHWin.mp4"
}));

commands.push(new videoOverlay({
	trigger: "hweenhlose",
	video: "lib/overlays/events/HweenHLose.mp4"
}));

commands.push(new videoOverlay({
	trigger: "hweenrwin",
	video: "lib/overlays/events/HweenRWin.mp4"
}));

commands.push(new videoOverlay({
	trigger: "hweenrlose",
	video: "lib/overlays/events/HweenRLose.mp4"
}));

commands.push(new videoOverlay({
	trigger: "hweenswin",
	video: "lib/overlays/events/HweenSWin.mp4"
}));

commands.push(new videoOverlay({
	trigger: "hweenslose",
	video: "lib/overlays/events/HweenSLose.mp4"
}));

/********************************** House Cup *********************************/
commands.push(new videoOverlay({
	trigger: "ag5",
	video: "lib/overlays/events/05PointsGryffindor.mp4"
}));

commands.push(new videoOverlay({
	trigger: "ag10",
	video: "lib/overlays/events/10PointsGryffindor.mp4"
}));

commands.push(new videoOverlay({
	trigger: "ah5",
	video: "lib/overlays/events/05PointsHufflepuff.mp4"
}));

commands.push(new videoOverlay({
	trigger: "ah10",
	video: "lib/overlays/events/10PointsHufflepuff.mp4"
}));

commands.push(new videoOverlay({
	trigger: "ar5",
	video: "lib/overlays/events/05PointsRavenclaw.mp4"
}));

commands.push(new videoOverlay({
	trigger: "ar10",
	video: "lib/overlays/events/10PointsRavenclaw.mp4"
}));

commands.push(new videoOverlay({
	trigger: "as5",
	video: "lib/overlays/events/05PointsSlytherin.mp4"
}));

commands.push(new videoOverlay({
	trigger: "as10",
	video: "lib/overlays/events/10PointsSlytherin.mp4"
}));

commands.push(new videoOverlay({
	trigger: "minuspoints",
	video: "lib/overlays/events/MinusPoints.mp4"
}));

commands.push(new videoOverlay({
	trigger: "cupgwins",
	video: "lib/overlays/events/GryffindorWins.mp4"
}));

commands.push(new videoOverlay({
	trigger: "cuphwins",
	video: "lib/overlays/events/HufflepuffWins.mp4"
}));

commands.push(new videoOverlay({
	trigger: "cuprwins",
	video: "lib/overlays/events/RavenclawWins.mp4"
}));

commands.push(new videoOverlay({
	trigger: "cupswins",
	video: "lib/overlays/events/SlytherinWins.mp4"
}));

commands.push(new videoOverlay({
	trigger: "gold",
	video: "lib/overlays/events/gold.mp4"
}));


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

// Sound board - Trigger overlays from a web-based UI

var soundboard = require('./lib/twitch-soundboard');
soundboard.start({events: eventbus});
