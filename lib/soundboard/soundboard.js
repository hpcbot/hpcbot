/* server.js - Simple http server to serve overlays */

var Events = require('events');
var extend = require('extend');
var path = require('path');

var lists = [];  // List of overlays that have been loaded
var events = {};  // List of valid events (kept separate for speed)

class Soundboard {
  constructor(_options) {
    // Pass in options
    this.options = {
        events: new Events.EventEmitter()           // Listens to events to trigger overlays
    };

    this.options = extend(this.options, _options);    // Copy _options into options, overwriting defaults

    /* Configure server variables */
    this.server = {
      route: '/soundboard',
      index: path.join(__dirname, 'views/index.pug'),
      static: path.join(__dirname, 'static'),
      css: '<style></style>'
    };

    this.options.events.on('soundboard:add', (list) => {
      this.add(list)
    })
  }

  onConnect(socket) {
    socket.on('soundboard', (event, parameters) => {
      if(parameters) {
        this.options.events.emit(event, ...parameters)  // Convert parameters to actual function parameters
      } else {
        this.options.events.emit(event)
      }

    })

    /* Send update when anyone connects */
    this.update();

    socket.on('disconnect', () => {
      this.update(); // Send update when someone disconnects
    });
  }

  update() {
    // Called any time we update the state on the server

    let _state = {
      lists: lists
    }

    this.options.events.emit('soundboard:state', _state)  // Tell the server to send an update to all connected clients
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
      lists.push(list)
    })
  }

  css(file) {
    // Set a custom css file
    this.server.css = file
  }
}

module.exports = Soundboard
