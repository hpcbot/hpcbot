// channel/index.js
var channel = require('./channel.js')

var db;
var eventbus

var start = function start(_db, _eventbus) {
	// Creates the user module
	// Input: db - pass in the db module, eventbus - pass in the global pubsub channel

	db = _db;
  eventbus = _eventbus;

  eventbus.on('twitch:users', setUsersInChannel);
};

var setUsersInChannel = function setUsersInChannel(users) {
  // Input: An object with a list of users
  console.log(users);
}

module.exports = {
  start: start
}
