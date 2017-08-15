/* server.js - Simple http server to serve overlays */

var express = require('express');
var Events = require('events');
var extend = require('extend');
var path = require('path');

var app = express();    // Express should be accessible from all functions

// config variables w/ default values
var options = {
    hostname: 'localhost',                      // Binds server to this host (optional)
    port: 4000,                                 // Binds server to this port
    directory: '/',                             // URL you want to point OBS/Xsplit at (optional, default: '/')
    viewEngine: 'pug',                          // Templating system you'd like to use (Express-compatible) (optional: defaults to pug) */
    events: new Events.EventEmitter()           // Listens to events to trigger overlays
};

// var socket;
var io;
var overlays = [];  // List of overlays that have been loaded
var clients = {};   // List of clients that are connected (for cleaning events)

var start = function start(_options) {
    // Options for starting the overlay server:
    options = extend(options, _options);    // Copy _options into options, overwriting defaults

    /* Start webapp */
    app.use(express.static(path.join(__dirname, 'static')));
    app.set('views', path.join(__dirname, 'views'));
    app.locals.basedir = app.get('views');
    app.set('view engine', options.viewEngine);

    app.get(options.directory, function (req, res, next) {
      try {
        res.render('index');
      } catch (e) {
        next(e)
      }
    });

    // Start server
    var server = require('http').Server(app);
    var port = options.port;
    server.listen(port);
    console.log('Listening on port ' + port);

    // Start Socket IO (event handler)
    io = require('socket.io')(server);

    io.on('connection', function (socket) {
        socket.on('gift', function() {
          options.events.emit('gift:show');
        });
    });

    //Debugging
    // setInterval(function() {
      // console.log('Active clients: ' + Object.keys(io.sockets.sockets).length);
      // console.log('Listening to POWERMOVE: ' + options.events.listeners('stream:powermove'));
      // console.log(clients);
    // }, 5000);
};

module.exports = {
    start: start,
    options: options    // Expose options - useful for testing
};
