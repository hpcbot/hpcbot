// channel/index.js
var channel = require('./channel.js')

var db;
var eventbus;
var list = 'channel'; // The key in redis where we'll store the list of current users

var start = function start(_db, _eventbus) {
	// Creates the user module
	// Input: db - pass in the db module, eventbus - pass in the global pubsub channel

	db = _db;
  eventbus = _eventbus;

  // Clear the list of users currently in the channel on startup
  updateUserList([]);

  eventbus.on('twitch:users', updateUserList);
};

var updateUserList = function (users) {
  // Process new users who joined the channel (called every few seconds)

  // Get current list and store for a hot minute
  getActiveUsers(function(err, oldUsers) {

    // Wipe the list and insert the new list we grabbed from twitch
    setActiveUsers(users, function(err, data) {

    });
  });
};

var getActiveUsers = function(callback) {
  // Returns a list of users currently in the channel
  // Input: none
  db.get().lrange(list, 0, -1, function(err, data) {
    console.log('err: ' + err);
    console.log('data: ' + data);
    if(!err) {
      callback(null, data);
    }
    else {
      callback(err, null);
    }
  });
}
var setActiveUsers = function (users, callback) {
  // **Note: This will wipe the current list of users**
  // Update the list of users currently in the channel
  // Input: An array with a list of usernames e.g. ['hpc_dumbledore', 'bdickason']

  // Wipe the current list of users in the channel
  db.get().del(list, function(err, data) {
    console.log('err: ' + err);
    console.log('data: ' + data);
    if(!err) {
      db.get().lpush(list, users, function(err, data) {
          if(!err) {
            callback(null, data);
          }
          else {
            callback(err, null);
          }
      });
    }
    else {
      callback(err, null);
    }
  });
};

module.exports = {
  start: start,
  list: list,
  getActiveUsers: getActiveUsers,
  setActiveUsers: setActiveUsers
};
