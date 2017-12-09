/* server.js - hpc web server which initializes other twitch services */

var Events = require('events');
var extend = require('extend');
var path = require('path');

var express = require('express');
var app = express();

// config variables w/ default values
var options = {
    hostname: 'localhost',                      // Binds server to this host (optional)
    port: 5000,                                 // Binds server to this port
    directory: '/',                              // URL you want to point at (optional, default: '/')
    events: new Events.EventEmitter()           // Listens to events to trigger overlays
};

var io;
var server;

// Synchronize clients
var clients = {};   // List of clients that are connected (for cleaning events)
var host = null;    // Which client will retain the authority for syncing timestamps?

var start = function(_options) {

  options = extend(options, _options);  // Copy _options into options, overwriting defaults
  // Start webserver
  startServer();

  /* Initialize Socket (communicating with client) */
  io = require('socket.io')(server);

  io.on('connection', function (socket) {
    // Client (React) has connected

    /* Add client to list of active users */
    addClient(socket.id);

    socket.on('disconnect', function() {
      // Clean up our list of clients when they disconnect
      removeClient(socket.id);
    });

    if(options.music) {
      /* Initialize music listeners */
      options.music.onConnect(socket);
      options.events.on('music:state', state);
    }
  });
}

var startServer = function() {
  /* Start webapp */
  app.use(express.static(path.join(__dirname, 'static')));
  app.set('views', path.join(__dirname, 'views'));
  app.locals.basedir = app.get('views');
  app.set('view engine', 'pug');

  if(options.music && options.music.server) {
    /* Initialize music route, static dir */
    app.get('/music', function(req, res, next) {
      res.render(options.music.server.index);
    });

    app.use('/music', express.static(options.music.server.static))
  }

  app.get(options.directory, function (req, res, next) {
    try {
      res.render('index');
    } catch (e) {
      next(e)
    }
  });

  // Start server
  server = require('http').Server(app);
  var port = options.port;
  server.listen(port);
  console.log('Listening on port ' + port);
}

var addClient = function(id) {
  clients[id] = true;
  options.events.emit('client:connected', id);

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

/*
// Twitch authentication
var passport = require('passport');
var Strategy = require('passport-twitch').Strategy;
*/

module.exports = {
    start: start
}
