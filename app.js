/* App.js - Main app file for hpc-bot */

require('dotenv').config();	// Load environment variables from .env

var eventbus = require('./lib/eventbus'); // Global event bus that modules can pub/sub to

// Initialize Mixpanel for logging
var Mixpanel = require('mixpanel');
var mixpanelConfig = require('./config/mixpanel-options.js');

var mixpanel;
if(mixpanelConfig.options) {
	mixpanel = Mixpanel.init(mixpanelConfig.options);
}

// Initialize Twitch connection
var tmi = require("tmi.js");	// Initialize tmi.js here so we can inject it during testing
var twitchConfig = require("./lib/twitch/config/tmi-options.js");
var twitchClient = new tmi.client(twitchConfig.options);
twitchClient.connect();

var Twitch = require('./lib/twitch');
Twitch.start(eventbus, twitchClient, config.options.channels[0]);

var Chat = require ('./lib/chat');
Chat.start(eventbus, mixpanel);

// Load Models
var db = require('./lib/db');
db.connect();

var User = require('./lib/models/user');
User.start(db);


// Load Command Modules
var Rules = require('./lib/commands/rules');
Rules.start(eventbus);

var House = require('./lib/commands/house');
House.start(eventbus, User);

var Join = require('./lib/commands/join');
Join.start(eventbus, User);

var Commends = require('./lib/commands/commends');
Commends.start(eventbus, User);