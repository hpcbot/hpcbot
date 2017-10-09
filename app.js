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

var Team = require('./lib/models/team');
Team.start(db, mixpanel);

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

// !cup
var Housecup = require('./lib/commands/housecup');
Housecup.start(eventbus, Team);
commands.push(Housecup);

// !hween
var Halloween = require('./lib/commands/halloween');
Halloween.start(eventbus, Team);
commands.push(Halloween);


// Add video overlay commands
var videoOverlay = require('twitch-overlay-video');
// var videoOverlay = require('../twitch-overlay-video');

/* Events */

// !powermove
var Powermove = new videoOverlay({
	trigger: "powermove",
	eventbus: eventbus,
	video: "lib/overlays/events/powermove.mp4"
});
commands.push(Powermove);

// !2rnb
var Tworax = new videoOverlay({
	trigger: "tworax",
	eventbus: eventbus,
	video: "lib/overlays/events/tworax.mp4"
});
commands.push(Tworax);

// !hpcwins
var Hpcwins = new videoOverlay({
	trigger: "hpcwins",
	eventbus: eventbus,
	video: "lib/overlays/events/hpcwins.mp4"
});
commands.push(Hpcwins);

// !gift
var Gift = new videoOverlay({
	trigger: "gift",
	eventbus: eventbus,
	video: "lib/overlays/events/gift.mp4"
});
commands.push(Gift);

// !cheese
var Cheese = new videoOverlay({
	trigger: "cheese",
	eventbus: eventbus,
	video: "lib/overlays/events/cheese.mp4"
});
commands.push(Cheese);

// !smoke
var Smoke = new videoOverlay({
	trigger: "smoke",
	eventbus: eventbus,
	video: "lib/overlays/events/smokegank.mp4"
});
commands.push(Smoke);


// !muggle
var Muggle = new videoOverlay({
	trigger: "muggle",
	eventbus: eventbus,
	video: "lib/overlays/events/muggle.mp4"
});
commands.push(Muggle);

// !sac
var Sacrifice = new videoOverlay({
	trigger: "sac",
	eventbus: eventbus,
	video: "lib/overlays/events/sacrifice.mp4"
});
commands.push(Sacrifice);

// !first
var Firstblood = new videoOverlay({
	trigger: "first",
	eventbus: eventbus,
	video: "lib/overlays/events/Firstblood.mp4"
});
commands.push(Firstblood);

// !Buyback
var Buyback = new videoOverlay({
	trigger: "buyback",
	eventbus: eventbus,
	video: "lib/overlays/events/Buyback.mp4"
});
commands.push(Buyback);

// !open
// should be fullscreen
var Opening = new videoOverlay({
	trigger: "open",
	eventbus: eventbus,
	video: "lib/overlays/events/Opening.mp4"
});
commands.push(Opening);

// !close
// should be fullscreen
var Closing = new videoOverlay({
	trigger: "close",
	eventbus: eventbus,
	video: "lib/overlays/events/Closing.mp4"
});
commands.push(Closing);


/* Fake Ads */

// !kia
// should be fullscreen
var Kia = new videoOverlay({
	trigger: "kia",
	eventbus: eventbus,
	video: "lib/overlays/ads/kia.mp4"
});
commands.push(Kia);

// !monster
// should be fullscreen
var Monster = new videoOverlay({
	trigger: "monster",
	eventbus: eventbus,
	video: "lib/overlays/ads/monster.mp4"
});
commands.push(Monster);

// !polo
// should be fullscreen
var Polo = new videoOverlay({
	trigger: "polo",
	eventbus: eventbus,
	video: "lib/overlays/ads/Polo.mp4"
});
commands.push(Polo);
/********************************* Halloween **********************************/

var HweenGWin = new videoOverlay({
	trigger: "hweengwin",
	eventbus: eventbus,
	video: "lib/overlays/events/HweenGWin.mp4"
});
commands.push(HweenGWin);

var HweenGLose = new videoOverlay({
	trigger: "hweenglose",
	eventbus: eventbus,
	video: "lib/overlays/events/HweenGLose.mp4"
});
commands.push(HweenGLose);

var HweenHWin = new videoOverlay({
	trigger: "hweenhwin",
	eventbus: eventbus,
	video: "lib/overlays/events/HweenHWin.mp4"
});
commands.push(HweenHWin);

var HweenHLose = new videoOverlay({
	trigger: "hweenhlose",
	eventbus: eventbus,
	video: "lib/overlays/events/HweenHLose.mp4"
});
commands.push(HweenHLose);

var HweenRWin = new videoOverlay({
	trigger: "hweenrwin",
	eventbus: eventbus,
	video: "lib/overlays/events/HweenRWin.mp4"
});
commands.push(HweenRWin);

var HweenRLose = new videoOverlay({
	trigger: "hweenrlose",
	eventbus: eventbus,
	video: "lib/overlays/events/HweenRLose.mp4"
});
commands.push(HweenRLose);

var HweenSWin = new videoOverlay({
	trigger: "hweenswin",
	eventbus: eventbus,
	video: "lib/overlays/events/HweenSWin.mp4"
});
commands.push(HweenSWin);

var HweenSLose = new videoOverlay({
	trigger: "hweenslose",
	eventbus: eventbus,
	video: "lib/overlays/events/HweenSLose.mp4"
});
commands.push(HweenSLose);

/********************************** House Cup *********************************/
var Ag5 = new videoOverlay({
	trigger: "ag5",
	eventbus: eventbus,
	video: "lib/overlays/events/05PointsGryffindor.mp4"
});
commands.push(Ag5);

var Ag10 = new videoOverlay({
	trigger: "ag10",
	eventbus: eventbus,
	video: "lib/overlays/events/10PointsGryffindor.mp4"
});
commands.push(Ag10);

var Ah5 = new videoOverlay({
	trigger: "ah5",
	eventbus: eventbus,
	video: "lib/overlays/events/05PointsHufflepuff.mp4"
});
commands.push(Ah5);

var Ah10 = new videoOverlay({
	trigger: "ah10",
	eventbus: eventbus,
	video: "lib/overlays/events/10PointsHufflepuff.mp4"
});
commands.push(Ah10);

var Ar5 = new videoOverlay({
	trigger: "ar5",
	eventbus: eventbus,
	video: "lib/overlays/events/05PointsRavenclaw.mp4"
});
commands.push(Ar5);

var Ar10 = new videoOverlay({
	trigger: "ar10",
	eventbus: eventbus,
	video: "lib/overlays/events/10PointsRavenclaw.mp4"
});
commands.push(Ar10);

var As5 = new videoOverlay({
	trigger: "as5",
	eventbus: eventbus,
	video: "lib/overlays/events/05PointsSlytherin.mp4"
});
commands.push(As5);

var As10 = new videoOverlay({
	trigger: "as10",
	eventbus: eventbus,
	video: "lib/overlays/events/10PointsSlytherin.mp4"
});
commands.push(As10);

var Minuspoints = new videoOverlay({
	trigger: "minuspoints",
	eventbus: eventbus,
	video: "lib/overlays/events/MinusPoints.mp4"
});
commands.push(Minuspoints);

var Cupgwins = new videoOverlay({
	trigger: "cupgwins",
	eventbus: eventbus,
	video: "lib/overlays/events/GryffindorWins.mp4"
});
commands.push(Cupgwins);

var Cuphwins = new videoOverlay({
	trigger: "cuphwins",
	eventbus: eventbus,
	video: "lib/overlays/events/HufflepuffWins.mp4"
});
commands.push(Cuphwins);

var Cuprwins = new videoOverlay({
	trigger: "cuprwins",
	eventbus: eventbus,
	video: "lib/overlays/events/RavenclawWins.mp4"
});
commands.push(Cuprwins);

var Cupswins = new videoOverlay({
	trigger: "cupswins",
	eventbus: eventbus,
	video: "lib/overlays/events/SlytherinWins.mp4"
});
commands.push(Cupswins);


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
