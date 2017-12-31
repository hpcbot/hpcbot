/* server.js - Simple http server to serve overlays */

var Events = require('events');
var extend = require('extend');
var path = require('path');

var items = [];  // List of overlays that have been loaded

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
      static: path.join(__dirname, 'static')
    };

    this.options.events.on('soundboard:add', (list) => {
      this.add(list)
    })
  }

  onConnect(socket) {
    socket.on('soundboard', (event, payload) => {
      console.log('Soundboard event: ')
      console.log(event)
      console.log(payload)
    })

    /* Send update when anyone connects */
    this.update();

    socket.on('disconnect', () => {
      this.update(); // Send update when someone disconnects
    });
  }

  update() {
    // Called any time we update the state on the server

    let _state = items

    // io.sockets.emit('soundboard:state', _state)  // Send an update to all connected clients
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
  }
}

module.exports = Soundboard
