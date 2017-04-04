/* channel.js - Handles channel-wide variables (i.e. commends) */

var db;
var eventbus = require('../eventbus');

var start = function start(database) {
	// Creates the channel module
	// Input: db - pass in the db module
	if(database) {
		db = database;
	}
	else {
		throw ('Database not found');
	}

	listenToCommandSetCommends();
	listenToCommandGetCommends();
};

var listenToCommandSetCommends = function listenToCommandSetCommends() {
	// Sets commends (for Dobby because tbh noone else cares about commends)
	// Input: username, commends
	// Output: err, username, commends
	eventbus.on('channel:setcommends', function(username, commends) {
		setCommends(username, commends, function(err, amount) {
			if(!err) {
				console.log('got here');
				eventbus.emit('whisper:commendsset', err, username, amount);
			}
			else {
				eventbus.emit('error:issue', 'Error setting comments');
			}
		});
	});
};

var setCommends = function setComments(username, commends, callback) {
	// Set Commends - Saves a user's commends
	// If user is a mod
		// If user exists
			// Set commends
			db.get().hset('user:' + username, 'commends', commends, function(err, data) {
				callback(err, data);
			});
};

var listenToCommandGetCommends = function listenToCommendGetCommends() {

}
module.exports = {
	start: start
};
