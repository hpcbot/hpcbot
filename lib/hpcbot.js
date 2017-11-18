#!/usr/bin/env node
/* index.js - Main app file for hpc-bot */

exports = module.exports = createApplication;

function createApplication(options) {
  var path = require('path');
	// options.username -- Your twitch username
	// options.password -- Your twitch oauth hash from http://twitchapps.com/tmi/
	// options.channel 	-- Your twitch channel
	// options.clientID	-- Your twitch clientID from https://www.twitch.tv/settings/connections
	// options.mixpanel -- (optional) Pass in your mixpanel ID to send analytics to mixpanel
	var config = require('../config/options.js');
	options = config.validate(options);


	var eventbus = require('./eventbus'); // Global event bus that modules can pub/sub to

	// Initialize Twitch connection
	var tmi = require("tmi.js");	// Initialize tmi.js here so we can inject it during testing
	var twitchClient = new tmi.client(options);
	twitchClient.connect();

	// Initialize Mixpanel for logging
	var Mixpanel = require('mixpanel');
	var mixpanel;
	if(options.mixpanel) {
		mixpanel = Mixpanel.init(options.mixpanel);
		mixpanel.channel = options.channels[0];
	}

	var Twitch = require('./twitch');
	Twitch.start(eventbus, twitchClient, options.channels[0], options.clientID);

	// Load Models
	var db = require('./db');
	db.connect();

	var User = require('./models/user');
	User.start(db, mixpanel);

	var Channel = require('./models/channel');
	Channel.start(db, options.identity.username, eventbus, Twitch);

	var Team = require('./models/team');
	Team.start(db, mixpanel);

	var Resource = require('./models/resource');
	Resource.start(db, mixpanel);

	// Bot modules
	var Chat = require ('./chat');
	Chat.start(eventbus, mixpanel);

	var Overlays = require('twitch-overlay');
	// var Overlays = require('../twitch-overlay');
	Overlays.start({events: eventbus});

	/* Setup Bot Commands */
	var commands = [];

	// Message on Join
	var Join = require('./commands/join');
	Join.start(eventbus, User);
	commands.push(Join);

	// Goblin Gold
	var Gold = require('./commands/gold');
	Gold.start(eventbus, Resource, Channel);
	commands.push(Gold);

	// !setcommends / !commends
	var Commends = require('./commands/commends');
	Commends.start(eventbus, User);
	commands.push(Commends);

	// !rules
	var Rules = require('./commands/rules');
	Rules.start(eventbus);
	commands.push(Rules);

	// !house / !sortinghat
	var House = require('./commands/house');
	House.start(eventbus, User);
	commands.push(House);

	// !status
	var Status = require('./commands/status');
	Status.start(eventbus, User);
	commands.push(Status);

	// !dice / !coin
	var Random = require('./commands/random');
	Random.start(eventbus);
	commands.push(Random);

	// !cup
	var Housecup = require('./commands/housecup');
	Housecup.start(eventbus, Team);
	commands.push(Housecup);

	// !hween
	var Halloween = require('./commands/halloween');
	Halloween.start(eventbus, Team);
	commands.push(Halloween);

	// Subscribers
	var Subscribe = require('./commands/subscribe');
	Subscribe.start(eventbus);
	commands.push(Subscribe);

	// Quidditch
	var Quidditch = require('./commands/quidditch');
	Quidditch.start(eventbus, Team);
	commands.push(Quidditch);

	// Add video overlay commands
	var videoOverlay = require('twitch-overlay-video');
	// var videoOverlay = require('../twitch-overlay-video');
	videoOverlay.eventbus = eventbus;

/*
	var overlays =
	function overlays: function(_port) {
		var port = _port;
		console.log(port);

		function add = function(objects) {
			console.log('added ' + objects);
		}
	}

*/
	/* Events */
	// !powermove
	// commands.push(_overlay);

	commands.push(new videoOverlay({
		trigger: "powermove",
		video: path.join(__dirname, "overlays/events/powermove.mp4")
	}));

	// !2rnb
	commands.push(new videoOverlay({
		trigger: "tworax",
		video: path.join(__dirname, "overlays/events/tworax.mp4")
	}));

	// !hpcwins
	commands.push(new videoOverlay({
		trigger: "hpcwins",
		video: path.join(__dirname, "overlays/events/hpcwins.mp4")
	}));

	// !gift
	commands.push(new videoOverlay({
		trigger: "gift",
		video: path.join(__dirname, "overlays/events/gift.mp4")
	}));

	// !cheese
	commands.push(new videoOverlay({
		trigger: "cheese",
		video: path.join(__dirname, "overlays/events/cheese.mp4")
	}));

	// !smoke
	commands.push(new videoOverlay({
		trigger: "smoke",
		video: path.join(__dirname, "overlays/events/smokegank.mp4")
	}));


	// !muggle
	commands.push(new videoOverlay({
		trigger: "muggle",
		video: path.join(__dirname, "overlays/events/muggle.mp4")
	}));

	// !sac
	commands.push(new videoOverlay({
		trigger: "sac",
		video: path.join(__dirname, "overlays/events/sacrifice.mp4")
	}));

	// !first
	commands.push(new videoOverlay({
		trigger: "first",
		video: path.join(__dirname, "overlays/events/Firstblood.mp4")
	}));

	// !Buyback
	commands.push(new videoOverlay({
		trigger: "buyback",
		video: path.join(__dirname, "overlays/events/Buyback.mp4")
	}));

	// !open
	// should be fullscreen
	commands.push(new videoOverlay({
		trigger: "open",
		video: path.join(__dirname, "overlays/events/Opening.mp4")
	}));

	// !close
	// should be fullscreen
	commands.push(new videoOverlay({
		trigger: "close",
		video: path.join(__dirname, "overlays/events/Closing.mp4")
	}));


/// Fake Ads
	// !kia
	// should be fullscreen
	commands.push(new videoOverlay({
		trigger: "kia",
		video: path.join(__dirname, "overlays/ads/kia.mp4")
	}));

	// !monster
	// should be fullscreen
	commands.push(new videoOverlay({
		trigger: "monster",
		video: path.join(__dirname, "overlays/ads/monster.mp4")
	}));

	// !polo
	// should be fullscreen
	commands.push(new videoOverlay({
		trigger: "polo",
		video: path.join(__dirname, "overlays/ads/Polo.mp4")
	}));

/// Halloween
	commands.push(new videoOverlay({
		trigger: "hweengwin",
		video: path.join(__dirname, "overlays/events/HweenGWin.mp4")
	}));

	commands.push(new videoOverlay({
		trigger: "hweenglose",
		video: path.join(__dirname, "overlays/events/HweenGLose.mp4")
	}));

	commands.push(new videoOverlay({
		trigger: "hweenhwin",
		video: path.join(__dirname, "overlays/events/HweenHWin.mp4")
	}));

	commands.push(new videoOverlay({
		trigger: "hweenhlose",
		video: path.join(__dirname, "overlays/events/HweenHLose.mp4")
	}));

	commands.push(new videoOverlay({
		trigger: "hweenrwin",
		video: path.join(__dirname, "overlays/events/HweenRWin.mp4")
	}));

	commands.push(new videoOverlay({
		trigger: "hweenrlose",
		video: path.join(__dirname, "overlays/events/HweenRLose.mp4")
	}));

	commands.push(new videoOverlay({
		trigger: "hweenswin",
		video: path.join(__dirname, "overlays/events/HweenSWin.mp4")
	}));

	commands.push(new videoOverlay({
		trigger: "hweenslose",
		video: path.join(__dirname, "overlays/events/HweenSLose.mp4")
	}));

	/// House Cup
	commands.push(new videoOverlay({
		trigger: "ag5",
		video: path.join(__dirname, "overlays/events/05PointsGryffindor.mp4")
	}));

	commands.push(new videoOverlay({
		trigger: "ag10",
		video: path.join(__dirname, "overlays/events/10PointsGryffindor.mp4")
	}));

	commands.push(new videoOverlay({
		trigger: "ah5",
		video: path.join(__dirname, "overlays/events/05PointsHufflepuff.mp4")
	}));

	commands.push(new videoOverlay({
		trigger: "ah10",
		video: path.join(__dirname, "overlays/events/10PointsHufflepuff.mp4")
	}));

	commands.push(new videoOverlay({
		trigger: "ar5",
		video: path.join(__dirname, "overlays/events/05PointsRavenclaw.mp4")
	}));

	commands.push(new videoOverlay({
		trigger: "ar10",
		video: path.join(__dirname, "overlays/events/10PointsRavenclaw.mp4")
	}));

	commands.push(new videoOverlay({
		trigger: "as5",
		video: path.join(__dirname, "overlays/events/05PointsSlytherin.mp4")
	}));

	commands.push(new videoOverlay({
		trigger: "as10",
		video: path.join(__dirname, "overlays/events/10PointsSlytherin.mp4")
	}));

	commands.push(new videoOverlay({
		trigger: "minuspoints",
		video: path.join(__dirname, "overlays/events/MinusPoints.mp4")
	}));

	commands.push(new videoOverlay({
		trigger: "cupgwins",
		video: path.join(__dirname, "overlays/events/GryffindorWins.mp4")
	}));

	commands.push(new videoOverlay({
		trigger: "cuphwins",
		video: path.join(__dirname, "overlays/events/HufflepuffWins.mp4")
	}));

	commands.push(new videoOverlay({
		trigger: "cuprwins",
		video: path.join(__dirname, "overlays/events/RavenclawWins.mp4")
	}));

	commands.push(new videoOverlay({
		trigger: "cupswins",
		video: path.join(__dirname, "overlays/events/SlytherinWins.mp4")
	}));

	commands.push(new videoOverlay({
		trigger: "gold",
		video: path.join(__dirname, "overlays/events/gold.mp4")
	}));

	/// Quidditch
	// Gryffindor Wins
	commands.push(new videoOverlay({
		trigger: "qgw",
		video: path.join(__dirname, "overlays/events/QuidditchGryffindorWin.mp4")
	}));

	// Hufflepuff Wins
	commands.push(new videoOverlay({
		trigger: "qhw",
		video: path.join(__dirname, "overlays/events/QuidditchHufflepuffWin.mp4")
	}));

	// Ravenclaw Wins
	commands.push(new videoOverlay({
		trigger: "qrw",
		video: path.join(__dirname, "overlays/events/QuidditchRavenclawWin.mp4")
	}));

	// Slytherin Wins
	commands.push(new videoOverlay({
		trigger: "qsw",
		video: path.join(__dirname, "overlays/events/QuidditchSlytherinWin.mp4")
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

	var soundboard = require('./twitch-soundboard');
	soundboard.start({events: eventbus});

}

/* Expose middleware */
exports.overlay = require('twitch-overlay');
