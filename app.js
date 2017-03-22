/* App.js - Main app file for hpc-bot */

require('dotenv').config();	// Load environment variables from .env

var tmi = require("tmi.js");
var config = require("./config/tmi-options.js");

var client = new tmi.client(options);

client.connect();
