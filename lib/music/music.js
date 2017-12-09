/* music.js - Viewer playlist and music requests  */

var Events = require('events');
var extend = require('extend');
var path = require('path');

var urlParser = require('js-video-url-parser');


// config variables w/ default values
var options = {
    socket: null,
    events: new Events.EventEmitter()           // Listens to events to trigger overlays
};

// Command to allow users to add songs via chat
var commands = [{
	name: 'music',
	type: 'chat',
	event: 'music:add'
}];

/* Web server variables */
let host = null;
let clients = [];
var server = {
  route: '/music',
  index: path.join(__dirname, 'views/index.pug'),
  static: path.join(__dirname, 'static')
};

var Playlist;       // The actual db object for our playlist
let state = {};     // Persistent state for the app

var playing = false;
var timestamp;

// User requests
var lastRequest = null;    // Keep track of the last song requested (if any)


var start = function start(_options) {
    // Options for starting the music server
    options = extend(options, _options);    // Copy _options into options, overwriting defaults
    Playlist = options.Playlist;
    Song = options.Song;

    /* Create initial state when server starts */
    update();

    /* Add chat listeners so users can request songs */
    options.events.on('music:add', chatAddSong);

    /* Add listeners for web server events (clients connecting, etc) */
    options.events.on('host:set', setHost);
    options.events.on('client:connected', addClient);
    options.events.on('client:disconnected', removeClient);
};

var onConnect = function(socket) {
  /* Listen to client events */
  socket.on('addSong', addSong);
  socket.on('removeSong', removeSong);
  socket.on('playSong', playSong);
  socket.on('skipSong', function() {
    removeSong(state.videoId);  // Remove songs when we finish them
  });
  socket.on('shuffle', shuffle);
  socket.on('endSong', function() {
    // Prevents two users from ending a song at the same time
    if(socket.id == host) {
      removeSong(state.videoId);
    }
  });
  socket.on('reorder', reorder);

  // Client can send seek events when they jump ahead in timestamp
  socket.on('seek', function(duration) {
    socket.broadcast.emit('seek', duration)
  });

  socket.on('playing', toggle);

  socket.on('timestamp', function(timestamp) {
    if(socket.id == host) {
      // This user is the host, sync everyone with them
      socket.broadcast.emit('sync', timestamp);
    }
  });

  /* Send update when anyone connects */
  update();

  socket.on('disconnect', function() {
    update(); // Send update when someone disconnects
  });
}


var update = function () {
  // Called any time we update the state on the server
  Playlist.state(function(err, _state) {
    Song.getList(_state.songs, function(err, list) {
      // Add song list here?
      state = _state;
      state.metadata = list;

      // Mix in realtime events
      state.playing = playing;
      state.host = host;

      state.clients = [];
      for(const client in clients) {
        state.clients.push(client);
      }

      options.events.emit('music:state', state);  // Send an update to all connected clients
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
  let userRequest = false;

  let url = urlParser.parse(song);

  if(url) {
    if(source != 'chat' && url.list) {
      // User requested a playlist
      Song.addList(url.list, function(err, songs) {
        if(!err) {
          var list = [];

          // Loop through adding songs to playlist
          songs.forEach(function(song) {
            Playlist.add(song, function(err, repsonse) {
              if(!err) {
                list.push(song);
                if(list.length == songs.length) {
                  // We finished adding the list
                  update();
                }
              }
            });
          });
        }
      })
    } else if (source == 'chat') {
      // Single song user request via chat
      let error;

      if(url.id) {
        id = url.id;
      }

      Playlist.addAfter(id, lastRequest, function(err, success) {
        if(err) {
          error = err;
        }

        lastRequest = id; // Bump lastRequest object to currently requested song

        Song.add(id, function(err, metadata) {
          if(err) {
            error = err;
          }

          if(error) {
            options.events.emit('twitch:say', [error])
          } else {
            options.events.emit('twitch:say', ['Successfully added song: ' + metadata.title]);
          }
          update();
        })
      });
    } else {
      // Single song posted via admin dashboard
      if(url.id) {
        id = url.id;

        Playlist.add(id, function(err, success) {
          if(!err) {
            Song.add(id, function(err, metadata) {
              if(!err) {
                error = err;
                update();
              }
            });
          }
        });
      }
    }
  }
}

var removeSong = function(song) {
  // Someone removed a song from the playlist (or the song completed?)
  Playlist.remove(song, function(err, success) {
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

// User suggested a song via chat
var chatAddSong = function(username, parameters) {
  if(parameters) {
    addSong(parameters, 'chat');
  }
}

var shuffle = function() {
  Playlist.shuffle(function(err, success) {
    update();
  });
}

var reorder = function(start, end) {
  Playlist.reorder(start, end, function(err, success) {
    update();
  });
}

var setHost = function(_host) {
  // A new user is now host
  host = _host;
}

var addClient = function(client) {
  // a new client has connected
  clients[client] = true;
}

var removeClient = function(client) {
  // a client has disconnected
  clients[client] = null;
}


module.exports = {
    start: start,
    options: options,    // Expose options - useful for testing
    onConnect: onConnect,
    commands: commands,
    server: server,
    setHost: setHost
};
