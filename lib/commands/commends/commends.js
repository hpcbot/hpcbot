/* commends.js - !Command to set and get a user's commends
*/

var strings = require('../../../config/strings.json');

var eventbus; // Global event bus that modules can pub/sub to
var db;
var User;

var start = function start(_eventbus, _db, _User) {
	eventbus = _eventbus;
	db = _db;
	User = _User;

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
	User.getCommends(username, function(err, commends) {
		if(!err && commends) {
			if(self) {
				response.push(target + strings.commends.user_has + commends + strings.commends.commends);
			}
			else {
				response.push(target + strings.commends.user_has + commends + strings.commends.commends + strings.commends.jealous);	
			}
			eventbus.emit('twitch:say', response);
		}
		else {
			if(err == 'User Not Found') {
				response.push(strings.commends.cant_find + username);
				eventbus.emit('twitch:say', response);
			}
			else if(err == 'User Has No Commends') {
				response.push(username + strings.commends.no_commends);
				eventbus.emit('twitch:say', response);
			}
		}
	});
};

var setCommends = function setCommends(username, parameters) {
	// Set Commends - Saves a user's commends
	// If user is a mod
		// If user exists
			// Set commends
	var response = [];

	User.setCommends(username, parameters, function(err, commends) {
		if(!err) {
			response.push(strings.commends.saved + commends);
		}
		else {
			if(err == 'no commends provided') {
				// User passed in no commends
				response.push(strings.commends.error + strings.commends.no_parameter);
			}
			else if(err == 'commends not a number') {
				response.push(strings.commends.error + strings.commends.non_number);
			}
		}

		eventbus.emit('twitch:whisper', username, response);			
	});
};

module.exports = {
	start: start
};