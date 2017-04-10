/* commends.js - !Command to set and get a user's commends
*/

var strings = require('../../../config/strings.json');

var eventbus; // Global event bus that modules can pub/sub to
var db;

var start = function start(_eventbus, _db) {
	eventbus = _eventbus;
	db = _db;

	eventbus.on('commends:get', getCommends);
	eventbus.on('commends:set', setCommends);	// Apply to the Sorting Hat!
};

var getCommends = function getCommends(username, parameters) {
	// Get a specific user's commends
	var target;
	var self=true;	// Are they asking for themselves? Or for someone else

	if(parameters != null) {
		// User is looking for someone else's commends
		target = parameters;
		self = false;
	}
	else {
		// User is looking for their own commends
		target = username;
	}

	var response = [];

	// Get a specific users commends
	db.get().hget('user:' + username, 'commends', function(err, data) {
		if(!err && data != null) {
			if(self) {
				response.push(target + strings.commends.user_has + data + strings.commends.commends);
			}
			else {
				response.push(target + strings.commends.user_has + data + strings.commends.commends + strings.commends.jealous);	
			}
			eventbus.emit('twitch:say', response);
		}
		else {
			// User not found
			response.push(strings.commends.cant_find + username)
			eventbus.emit('twitch:say', response);
		}
	});
};

var setCommends = function getCommends(username, parameters) {
	// Set Commends - Saves a user's commends
	// If user is a mod
		// If user exists
			// Set commends
	if(commends) {
		db.get().hset('user:' + username, 'commends', commends, function(err, data) {
			callback(err, data);
		});
	}
	else {
		// User passed in no commends
		callback('Error setting commends', null);
	}
};

module.exports = {
	start: start
};