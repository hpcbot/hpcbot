/* music.js - Viewer playlist and music requests  */

var express = require('express');
var Events = require('events');
var extend = require('extend');
var path = require('path');

var urlParser = require('js-video-url-parser');

var app = express();    // Express should be accessible from all functions

// config variables w/ default values
var options = {
    hostname: 'localhost',                      // Binds server to this host (optional)
    port: 5000,                                 // Binds server to this port
    directory: '/',                             // URL you want to point OBS/Xsplit at (optional, default: '/')
    events: new Events.EventEmitter()           // Listens to events to trigger overlays
};

// Command to allow users to add songs via chat
var commands = [{
	name: 'music',
	type: 'chat',
	event: 'music:add'
}];

var io;
var clients = {};   // List of clients that are connected (for cleaning events)
var server;

var Playlist;       // The actual db object for our playlist
let state = {};     // Persistent state for the app

// Synchronize clients
var clients = {};   // List of currently connected clients
var host = null;    // Which client will retain the authority for syncing timestamps?
var playing = false;
var timestamp;

var start = function start(_options) {
    // Options for starting the music server
    options = extend(options, _options);    // Copy _options into options, overwriting defaults
    Playlist = options.Playlist;
    Song = options.Song;

    // Start webserver
    startServer();

  /* Initialize Socket (communicating with client) */
    io = require('socket.io')(server);

    io.on('connection', function (socket) {
      // Client (React) has connected - see ./client/music-client.jsx
      // socket.emit('state', state); // Send initial state to client

      /* Listen to client events */
      socket.on('addSong', addSong);
      socket.on('removeSong', removeSong);
      socket.on('playSong', playSong);
      socket.on('skipSong', skipSong);
      socket.on('playing', toggle);

      socket.on('timestamp', function(timestamp) {
        if(socket.id == host) {
          // This user is the host, sync everyone with them
          socket.broadcast.emit('sync', timestamp);
        }
      });

      /* Add client to list of active users */
      addClient(socket.id);


      /* Send update when anyone connects */
      update();

      socket.on('disconnect', function() {
        // Clean up our list of clients when they disconnect
        removeClient(socket.id);

        update(); // Send update when someone disconnects
      });
    });

    /* Create initial state when server starts */
    update();

    /* Add chat listeners so users can request songs */
    options.events.on('music:add', chatAddSong);

};

var update = function () {
  // Called any time we update the state on the server
  Playlist.state(function(err, _state) {
    Song.getList(_state.songs, function(err, list) {
      // Add song list here?
      state = _state;
      state.metadata = list;

      // Mix in realtime events
      state.playing = playing;

      state.clients = [];
      for(const client in clients) {
        state.clients.push(client);
      }

      state.host = host;

      io.sockets.emit('state', state);  // Send an update to all connected clients
    })
  });

}

var playSong = function(song) {
  // Change the currently selected song
  Playlist.play(song, function(err, success) {
    update();
  });
}

var addSong = function(song, source) {
  // Someone added a song to the playlist
  let id;

  let url = urlParser.parse(song);

  if(url.list) {
    // User requested a playlist
    Song.addList(url.list, function(err, songs) {
      if(err) {
        error = err;
      }
      var list = [];
      // Loop through adding songs to playlist
      songs.forEach(function(song) {
        Playlist.add(song, function(err, repsonse) {
          if(!err) {
            list.push(song);
            if(list.length == songs.length) {
              if(source == 'chat') {
                if(error) {
                  options.events.emit('twitch:say', [error])
                } else {
                  options.events.emit('twitch:say', ['Successfully added playlist']);
                }
                update();
              }
            }
          }
        });
      });
    })
  } else {
    id = url.id;

    var error;

    Playlist.add(id, function(err, success) {
      if(err) {
        error = err;
      }
      Song.add(id, function(err, metadata) {
        if(err) {
          error = err;
        }
        // Grab metadata from youtube
        if(source == 'chat') {
          if(error) {
            options.events.emit('twitch:say', [error])
          } else {
            options.events.emit('twitch:say', ['Successfully added song: ' + metadata.title]);
          }
        }
        update();
      })
    });
  }
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

/* Synchronizing Video */

// Synchronize video play/pause across sessions
var toggle = function(status) {
    // Client pressed play or pause
    playing = status;
    update();
}

var addClient = function(id) {
  clients[id] = true;
  if(!host) {
    host = id;
  }
}

var removeClient = function(id) {
  delete(clients[id]);  // Remove them from the list of active users

  if(host == id) {
    // We need a new host!
    // Check if any clients are still connected
    var _clients = Object.keys(clients);

    if(_clients.length > 0) {
      host = _clients[0]; // Set the next person in line to host
    }
  }
}


// User suggested a song via chat
var chatAddSong = function(username, parameters) {
  if(parameters) {
    addSong(parameters, 'chat');
  }
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
    options: options,    // Expose options - useful for testing
    commands: commands
};
