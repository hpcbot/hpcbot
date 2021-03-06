// channel/index.js
var channel = require('./channel.js')

var db;
var botUsername;
var eventbus;
var Twitch;
var list = 'channel'; // The key in redis where we'll store the list of current users

var start = function start(_db, _botUsername, _eventbus, _Twitch) {
	// Creates the user module
	// Input: db - pass in the db module, eventbus - pass in the global pubsub channel

	db = _db;
	botUsername = _botUsername;
  eventbus = _eventbus;
	Twitch = _Twitch

  // Clear the list of users currently in the channel on startup
  updateUserList([]);
  eventbus.on('twitch:users', updateUserList);
};

var updateUserList = function (users) {
  // Process new users who joined the channel (called every few seconds)
	// Remove bot from list
		var index = users.indexOf(botUsername);
		if(index > -1) {
			users.splice(index, 1);	// Remove the bot from the array of users
		}
  // Get current list and store for a hot minute
  getActiveUsers(function(err, oldUsers) {
    if(!err) {
      // Wipe the list and insert the new list we grabbed from twitch
      setActiveUsers(users, function(err, data) {
        if(!err) {
          var newUsers = users.filter(function(el) {
            return(oldUsers.indexOf(el) < 0);
          });

          eventbus.emit('user:join', newUsers);
        }
      });
    }
  });
};

var getActiveUsers = function(callback) {
  // Returns a list of users currently in the channel
  // Input: none
  db.get().lrange(list, 0, -1, function(err, data) {
    if(!err) {
      callback(null, data);
    }
    else {
      callback(err, null);
    }
  });
};

var setActiveUsers = function (users, callback) {
  // **Note: This will wipe the current list of users**
  // Update the list of users currently in the channel
  // Input: An array with a list of usernames e.g. ['hpc_dumbledore', 'bdickason']

  // Wipe the current list of users in the channel
  db.get().del(list, function(err, data) {
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

function isLive() {
	// Check if the stream is live (true/false)
	return(Twitch.isLive());
};

module.exports = {
  start: start,
  list: list,
  getActiveUsers: getActiveUsers,
  setActiveUsers: setActiveUsers,
	isLive: isLive
};
