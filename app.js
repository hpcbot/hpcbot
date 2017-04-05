/* App.js - Main app file for hpc-bot */

require('dotenv').config();	// Load environment variables from .env

var eventbus = require('./lib/eventbus'); // Global event bus that modules can pub/sub to

// Initialize Twitch connection
var tmi = require("tmi.js");	// Initialize tmi.js here so we can inject it during testing
var config = require(".lib/twitch/config/tmi-options.js");
var twitchClient = new tmi.client(config.options);
twitchClient.connect();

var Twitch = require('./lib/twitch');
var twitch = Twitch.start(twitchClient, config.options.channels[0]);

var Chat = require ('./lib/chat');
var chat = Chat.start();

var Commands = require ('./lib/commands');
var commands = Commands.start();

var db = require('./lib/db');
db.connect();

var User = require ('./lib/user');
var user = User.start(db);

var Channel = require ('./lib/channel');
var channel = Channel.start(db);
