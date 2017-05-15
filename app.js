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

var Chat = require ('./lib/chat');
Chat.start(eventbus, mixpanel);

// Load Models
var db = require('./lib/db');
db.connect();

var User = require('./lib/models/user');
User.start(db, mixpanel);


// Load Command Modules
var Rules = require('./lib/commands/rules');
Rules.start(eventbus);

var House = require('./lib/commands/house');
House.start(eventbus, User);

var Join = require('./lib/commands/join');
Join.start(eventbus, User);

var Commends = require('./lib/commands/commends');
Commends.start(eventbus, User);

var Status = require('./lib/commands/status');
Status.start(eventbus, User);

var Powermove = require('./lib/commands/powermove');
Powermove.start(eventbus);

var TwoRax = require('./lib/commands/tworax');
TwoRax.start(eventbus);

var Text = require('./lib/commands/text');
Text.start(eventbus);


// Configure overlay server
var options = {
    events: eventbus // Pass in our eventbus so we can call events directly
};

var Overlays = require('twitch-overlay');
// var Overlays = require('../twitch-overlay');
Overlays.start(options);

// Initialize individual overlays
Overlays.add(House.overlay);
Overlays.add(Powermove.overlay);
Overlays.add(TwoRax.overlay);
Overlays.add(Text.overlay);
