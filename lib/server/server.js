/* server.js - hpc web server which initializes other twitch services */

var Events = require('events');
var extend = require('extend');
var path = require('path');

var express = require('express');
var app = express();

var passport = require('passport');
var twitchAuth = require('./lib/twitch-auth');

var session = require('express-session');
var cookieParser   = require("cookie-parser");
var cookieSession  = require("cookie-session");
var socketSession = require("express-socket.io-session");

// Passport for oauth
var twitchStrategy = require('passport-twitch').Strategy;

// config variables w/ default values
var options = {
    hostname: 'localhost',                      // Binds server to this host (optional)
    port: 5000,                                 // Binds server to this port
    directory: '/',                              // URL you want to point at (optional, default: '/')
    events: new Events.EventEmitter()           // Listens to events to trigger overlays
};

var io;
var server;
var expressSession;

// Synchronize clients
var clients = {};   // List of clients that are connected (for cleaning events)
var host = null;    // Which client will retain the authority for syncing timestamps?

var start = function(_options) {

  options = extend(options, _options);  // Copy _options into options, overwriting defaults

  expressSession = session({
    secret: 'test',
    resave: true,
    saveUninitialized: true,
    rolling: true
  });
  // Start webserver
  startServer();

  /* Initialize Socket (communicating with client) */
  io = require('socket.io')(server);

  // Sockets should share sessions with main app
  io.use(socketSession(expressSession, {
      autoSave:true
  }));

  io.on('connection', function (socket) {
    // Client (React) has connected

    /* Add client to list of active users */
    addClient(socket.id, socket.handshake.session);

    socket.on('disconnect', function() {
      // Clean up our list of clients when they disconnect
      removeClient(socket.id);
    });

    if(options.music) {
      /* Initialize music listeners */
      options.music.onConnect(socket);
    }
  });

  if(options.music) {
      options.events.on('music:state', state);
  }
}

var startServer = function() {
  /* Start webapp */
  app.use(express.static(path.join(__dirname, 'static')));
  app.set('views', path.join(__dirname, 'views'));
  app.locals.basedir = app.get('views');
  app.set('view engine', 'pug');
  // Configure express app
  app.use(cookieParser());
  app.use(expressSession);

  // Setup Twitch authentication
  twitchAuth(options, passport, app);

  if(options.music && options.music.server) {
    app.use('/music', express.static(options.music.server.static));
  }

  // Setup server urls
  app.get(options.directory, auth(), function (req, res, next) {
      // User just signed in via Twitch
      if(options.music && options.music.server) {
        res.render(options.music.server.index);
      }
  });

  // Start server
  server = require('http').Server(app);
  var port = options.port;
  server.listen(port);
  console.log('Listening on port ' + port);
}

var addClient = function(id, session) {
  if(session.passport) {
    if(session.passport.user) {
      clients[id] = session.passport.user;
      options.events.emit('client:connected', id, session.passport.user);
    }
  }

  if(!host) {
    host = id;
    updateHost();
  }
}

var removeClient = function(id) {
  delete(clients[id]);  // Remove them from the list of active users

  options.events.emit('client:disconnected', id);

  if(host == id) {
    // We need a new host!
    // Check if any clients are still connected
    var _clients = Object.keys(clients);

    if(_clients.length > 0) {
      host = _clients[0]; // Set the next person in line to host
      updateHost();
    }
  }
}

var updateHost = function() {
  /* Alert modules of a new host */
  options.events.emit('host:set', host);
}

var state = function(_state) {
  io.sockets.emit('state', _state); // Send an update to all connected clients
}

var auth = function() {
  // Middleware to check if a user is authenticated
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      // User isn't authenticated, send them to auth
      res.redirect('/auth/twitch')
    }
  }
}
/*
// Twitch authentication
*/

module.exports = {
    start: start
}
