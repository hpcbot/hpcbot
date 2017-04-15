/* server.js - Simple http server to serve overlays */

var express = require('express');
var path = require('path');

var strings = require('../../config/strings.json');

var eventbus = require('../eventbus');

var start = function start(_eventbus) {
	eventbus = _eventbus;
};

// Start webapp 
var app = express();
app.use(express.static(path.join(__dirname, 'static')));
app.set('views', path.join(__dirname, 'views'));
app.locals.basedir = app.get('views');
app.set('view engine', 'pug')

app.get('/', function (req, res, next) {
  try {
  	res.render('index');
  } catch (e) {
    next(e)
  }
});

// Start server
var server = require('http').Server(app);
server.listen(3000);
// app.listen(process.env.PORT || 3000, function () {
// 	console.log('Listening on http://localhost:' + (process.env.PORT || 3000));
// });

// Start Socket IO (event handler)
var io = require('socket.io')(server);

io.on('connection', function (socket) {

  eventbus.on('stream:house', function(house) {
  	socket.emit('overlay:house', { house: house });
  });

});



module.exports = {
	start: start
};
