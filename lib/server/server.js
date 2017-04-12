/* server.js - Simple http server to serve overlays */

var express = require('express');
var path = require('path');

var strings = require('../../config/strings.json');

var eventbus;

var start = function start(_eventbus) {
	eventbus = _eventbus;
};

// Start webapp
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.locals.basedir = app.get('views');
app.set('view engine', 'pug')

app.get('/', function (req, res, next) {
  try {
  	res.render('index', {
  		user: 'bdickason',
  		house: 'Gryffindor'
  	});
  } catch (e) {
    next(e)
  }
})

app.listen(process.env.PORT || 3000, function () {
	console.log('Listening on http://localhost:' + (process.env.PORT || 3000));
});


module.exports = {
	start: start
};
