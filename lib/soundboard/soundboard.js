/* server.js - Simple http server to serve overlays */

var express = require('express');
var Events = require('events');
var extend = require('extend');
var path = require('path');

var app = express();    // Express should be accessible from all functions



// var socket;
var io;
var items = [];  // List of overlays that have been loaded

class Soundboard {
  constructor(_options) {
    // Options for starting the overlay server:
    this.options = {
        hostname: 'localhost',                      // Binds server to this host (optional)
        port: 4000,                                 // Binds server to this port
        directory: '/',                             // URL you want to point OBS/Xsplit at (optional, default: '/')
        events: new Events.EventEmitter()           // Listens to events to trigger overlays
    };
    this.options = extend(this.options, _options);    // Copy _options into options, overwriting defaults

    this.options.events.on('soundboard:add', (list) => {
      this.add(list)
    })

    /* Start webapp */
    app.use(express.static(path.join(__dirname, 'static')));
    app.set('views', path.join(__dirname, 'views'));
    app.locals.basedir = app.get('views');
    app.set('view engine', this.options.viewEngine);

    app.get(this.options.directory, function (req, res, next) {
      try {
        res.render('index');
      } catch (e) {
        next(e)
      }
    });

    // Start server
    var server = require('http').Server(app);
    var port = this.options.port;
    server.listen(port);
    console.log('Listening on port ' + port);

    // Start Socket IO (event handler)
    io = require('socket.io')(server);

    io.on('connection', (socket) => {
      socket.on('soundboard', (event, payload) => {
        console.log('Soundboard event: ')
        console.log(event)
        console.log(payload)
      })

      update()  // Send the client the latest state
    })
  }

  update() {
    // Called any time we update the state on the server

    let _state = items

    io.sockets.emit('soundboard:state', _state)  // Send an update to all connected clients
  }

  add(_lists) {
    let queue = [] // items to be processed

    // Are we adding one or many?
    if(Array.isArray(_lists)) {
      // Process multiple items
      queue = _lists
    } else {
      queue.push(_lists)
    }

    queue.forEach((list) => {
      items.push(list)
    })

    update()
  }
}

module.exports = Soundboard
