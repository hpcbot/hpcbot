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
    // this.overlays = require('twitch-overlay');
    this.overlays = require('../../twitch-overlay');
    this.overlays.start({events: eventbus, port: 3000});

    // Initialize Twitch connection
    var tmi = require("tmi.js");	// Initialize tmi.js here so we can inject it during testing
    var twitchClient = new tmi.client(options);
    twitchClient.connect();

    // Initialize Mixpanel for logging
    var mixpanel = require('./mixpanel');
    mixpanel.start({events: eventbus, token: options.mixpanel, channel: options.channels[0]});

    var Twitch = require('./twitch');
    Twitch.start(eventbus, twitchClient, options.channels[0], options.clientID);

    // Load Models
    var db = require('./db');
    db.connect();

    var User = require('./models/user');
    User.start(db, eventbus);

    var Channel = require('./models/channel');
    Channel.start(db, options.identity.username, eventbus, Twitch);

    var Team = require('./models/team');
    Team.start(db, eventbus);

    var Resource = require('./models/resource');
    Resource.start(db, eventbus);

    // Bot modules
    var Chat = require ('./chat');
    Chat.start(eventbus);


    // var Overlays = require('twitch-overlay');
    // var Overlays = require('../twitch-overlay');
    // Overlays.start({events: eventbus});

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
    this.overlays.add(Quidditch.overlay);


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
      // if(command.overlay) {
        // Overlays.add(command.overlay);
      // }
    });

    // Sound board - Trigger overlays from a web-based UI

    var soundboard = require('./twitch-soundboard');
    soundboard.start({events: eventbus});
  }

  // Modules

}

/* Expose middleware */
