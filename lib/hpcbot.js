#!/usr/bin/env node
/* index.js - Main app file for hpc-bot */


// Events
// bot.on('twitch:chat');
// bot.on('overlay:blah');

// Commands
// bot.use('blah');
// bot.

exports = module.exports = class Hpcbot {

  constructor(options) {
    var path = require('path');

    /// modules
    // Config
    var config = require('../config/options.js');
    options = config.validate(options);

    var eventbus; // Global event bus that modules can pub/sub to
    if(options.eventbus) {
      eventbus = options.eventbus;
    }
    else {
      eventbus = require('./eventbus');
    }

    // overlays
    this.overlays = require('twitch-overlay');
    // this.overlays = require('../../twitch-overlay'); // For testing
    this.overlays.start({events: eventbus, port: 3000});

    /* Setup Bot Chat */
    // Chat/Whisper !commands
    this.commands = require('./chat/commands');
    this.commands.start({whitelist: options.whitelist, events: eventbus})

    // Twitch chat
    // Initialize Twitch connection
    var tmi = require("tmi.js");	// Initialize tmi.js here so we can inject it during testing
    var twitchClient = new tmi.client(options);
    twitchClient.connect();

    // Functionality built on top of twitch connetion
    this.twitch = require('./chat/twitch');
    this.twitch.start(eventbus, twitchClient, options.channels[0], options.clientID);

    // Load Models
    var db = require('./db');
    db.connect();

    this.User = require('../models/user');
    this.User.start(db, eventbus);

    this.Channel = require('../models/channel');
    this.Channel.start(db, options.identity.username, eventbus, this.twitch);

    this.Team = require('../models/team');
    this.Team.start(db, eventbus);

    this.Resource = require('../models/resource');
    this.Resource.start(db, eventbus);

    this.Playlist = require('../models/playlist');
    this.Playlist.start(db);

    // Commands
    var music = require('./music');
    music.start({events: eventbus, Playlist: this.Playlist});
    this.commands.add(music.commands);

    // Sound board - Trigger overlays from a web-based UI
    var soundboard = require('./twitch-soundboard');
    soundboard.start({events: eventbus});

    // Initialize Mixpanel for logging
    var mixpanel = require('./mixpanel');
    mixpanel.start({events: eventbus, token: options.mixpanel, channel: options.channels[0]});

  }

}

/* Expose middleware */
