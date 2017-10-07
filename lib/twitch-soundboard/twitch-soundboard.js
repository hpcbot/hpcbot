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
        socket.on('muggle', function() {
          options.events.emit('muggle:show');
        });
        socket.on('sac', function() {
          options.events.emit('sac:show');
        });
        socket.on('powermove', function() {
          options.events.emit('powermove:show');
        });
        socket.on('monster', function() {
          options.events.emit('monster:show');
        });
        socket.on('smoke', function() {
          options.events.emit('smoke:show');
        });
        socket.on('kia', function() {
          options.events.emit('kia:show');
        });
        socket.on('cheese', function() {
          options.events.emit('cheese:show');
        });
        socket.on('hpcwins', function() {
          options.events.emit('hpcwins:show');
        });
        socket.on('tworax', function() {
          options.events.emit('tworax:show');
        });
        socket.on('polo', function() {
          options.events.emit('polo:show');
        });
        socket.on('first', function() {
          options.events.emit('first:show');
        });
        socket.on('buyback', function() {
          options.events.emit('buyback:show');
        });
        socket.on('open', function() {
          options.events.emit('open:show');
        });
        socket.on('close', function() {
          options.events.emit('close:show');
        });
        socket.on('add g 5', function() {
          options.events.emit('cup:add', 'Dumbledore', 'g 5');
        });
        socket.on('add g 10', function() {
          options.events.emit('cup:add', 'Dumbledore', 'g 10');
        });
        socket.on('sub g 5', function() {
          options.events.emit('cup:remove', 'Dumbledore', 'g 5');
        });
        socket.on('sub g 10', function() {
          options.events.emit('cup:remove', 'Dumbledore', 'g 10');
        });
        socket.on('add h 5', function() {
          options.events.emit('cup:add', 'Dumbledore', 'h 5');
        });
        socket.on('add h 10', function() {
          options.events.emit('cup:add', 'Dumbledore', 'h 10');
        });
        socket.on('sub h 5', function() {
          options.events.emit('cup:remove', 'Dumbledore', 'h 5');
        });
        socket.on('sub h 10', function() {
          options.events.emit('cup:remove', 'Dumbledore', 'h 10');
        });
        socket.on('add r 5', function() {
          options.events.emit('cup:add', 'Dumbledore', 'r 5');
        });
        socket.on('add r 10', function() {
          options.events.emit('cup:add', 'Dumbledore', 'r 10');
        });
        socket.on('sub r 5', function() {
          options.events.emit('cup:remove', 'Dumbledore', 'r 5');
        });
        socket.on('sub r 10', function() {
          options.events.emit('cup:remove', 'Dumbledore', 'r 10');
        });
        socket.on('add s 5', function() {
          options.events.emit('cup:add', 'Dumbledore', 's 5');
        });
        socket.on('add s 10', function() {
          options.events.emit('cup:add', 'Dumbledore', 's 10');
        });
        socket.on('sub s 5', function() {
          options.events.emit('cup:remove', 'Dumbledore', 's 5');
        });
        socket.on('sub s 10', function() {
          options.events.emit('cup:remove', 'Dumbledore', 's 10');
        });
        socket.on('spook', function() {
          options.events.emit('halloween:spook');
        });
        socket.on('housetest', function() {
          options.events.emit('house:test');
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
