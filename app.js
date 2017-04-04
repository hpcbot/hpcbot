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

var Channel = require ('./lib/channel');
var channel = Channel.start(db);
