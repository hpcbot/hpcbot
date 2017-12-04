/* music.js - Viewer playlist and music requests  */

var express = require('express');
var Events = require('events');
var extend = require('extend');
var path = require('path');

var app = express();    // Express should be accessible from all functions

// config variables w/ default values
var options = {
    hostname: 'localhost',                      // Binds server to this host (optional)
    port: 5000,                                 // Binds server to this port
    directory: '/',                             // URL you want to point OBS/Xsplit at (optional, default: '/')
    events: new Events.EventEmitter()           // Listens to events to trigger overlays
};

var io;
var clients = {};   // List of clients that are connected (for cleaning events)
var server;

var Playlist;       // The actual db object for our playlist
let state = {};     // Persistent state for the app

var start = function start(_options) {
    // Options for starting the music server
    options = extend(options, _options);    // Copy _options into options, overwriting defaults
    Playlist = options.Playlist;

    // Start webserver
    startServer();

    // Start Socket IO (event handler)
    io = require('socket.io')(server);

    io.on('connection', function (socket) {
      // Client (React) has connected - see ./client/music-client.jsx
      socket.emit('state', state); // Send initial state to client

      /* Listen to client events */
      socket.on('addSong', addSong);
      socket.on('removeSong', removeSong);
      socket.on('playSong', playSong);
      socket.on('skipSong', skipSong);
    });

    // Create initial state
    update();


    //Debugging
    // setInterval(function() {
      // console.log('Active clients: ' + Object.keys(io.sockets.sockets).length);
      // console.log('Listening to POWERMOVE: ' + options.events.listeners('stream:powermove'));
      // console.log(clients);
    // }, 5000);
};

var update = function () {
  // Called any time we update the state on the server
  Playlist.state(function(err, _state) {
    state = _state;
    io.sockets.emit('state', state);  // Send an update to all connected clients
    console.log(state);
  });

}

var playSong = function(song) {
  // Change the currently selected song
  Playlist.play(song, function(err, success) {
    update();
  });
}

var addSong = function(song) {
  // Someone added a song to the playlist
  Playlist.add(song, function(err, success) {
    update();
  });
}

var removeSong = function(song) {
  // Someone removed a song from the playlist (or the song completed?)
  Playlist.remove(song, function(err, success) {
    update();
  });
}

var skipSong = function() {
  Playlist.skip(function(err, success) {
    update();
  });
}

var startServer = function() {
  /* Start webapp */
  app.use(express.static(path.join(__dirname, '../static')));
  app.set('views', path.join(__dirname, '../views'));
  app.locals.basedir = app.get('../views');
  app.set('view engine', 'pug');

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

module.exports = {
    start: start,
    options: options    // Expose options - useful for testing
};