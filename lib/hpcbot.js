#!/usr/bin/env node
/* index.js - Main app file for hpc-bot */

module.exports = class Hpcbot {

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

    /* Setup Logging* */

    this.log = require('./log');
    this.log.start({token: options.logglyToken, subdomain: options.logglySubdomain, events: eventbus});

    /* Setup Overlay Server */
    // overlays
    const Overlays = require('twitch-overlay');
    this.overlays = new Overlays({port: 3000, events: eventbus});

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

    /* Music playlist */
    var chance = require('chance').Chance();  // random number generator for shufflin'

    this.Playlist = require('../models/playlist');
    this.Playlist.start(db, chance);

    var google = require('googleapis'); // Connect to youtube api for video metadata
    var youtube = google.youtube('v3');

    this.Song = require('../models/song');
    this.Song.start(db, {youtubeKey: options.youtubeKey, youtube: youtube});

    var music = require('./music');
    music.start({events: eventbus, Playlist: this.Playlist, Song: this.Song});

    // Sound board - Trigger overlays from a web-based UI
    const Soundboard = require('./soundboard');
    this.soundboard = new Soundboard({events: eventbus});

    /* Web server */
    var server = require('./server');
    server.start({
      events: eventbus,
      hostname: options.hostname,
      twitchSecret: options.secret,
      twitchClientID: options.clientID,
      whitelist: options.whitelist,
      music: music,
      soundboard: this.soundboard
    });

    // Commands
    // Random Number Generator
    this.random = require('./random');
    this.random.start();


    // Initialize Mixpanel for logging
    var mixpanel = require('./mixpanel');
    mixpanel.start({events: eventbus, token: options.mixpanel, channel: options.channels[0]});

  }

}
