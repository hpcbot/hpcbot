/* user.js - Users in our channel */

var db;
var eventbus;

var start = function start(_eventbus, _db) {
	// Creates the user module
	// Input: db - pass in the db module

	eventbus = _eventbus;		
	db = _db;

};

// var listenToCommandSetCommends = function listenToCommandSetCommends() {
// 	// Sets commends (for Dobby because tbh noone else cares about commends)
// 	// Input: username, commends
// 	// Output: err, username, commends
// 	eventbus.on('user:setcommends', function(username, commends) {
// 		setCommends(username, commends, function(err, amount) {
// 			eventbus.emit('whisper:commendsset', err, username, amount);
// 		});
// 	});
// };

// var setCommends = function setCommends(username, commends, callback) {
// 	// Set Commends - Saves a user's commends
// 	// If user is a mod
// 		// If user exists
// 			// Set commends
// 	if(commends) {
// 		db.get().hset('user:' + username, 'commends', commends, function(err, data) {
// 			callback(err, data);
// 		});
// 	}
// 	else {
// 		// User passed in no commends
// 		callback('Error setting commends', null);
// 	}
// };

// var listenToCommandGetCommends = function listenToCommendGetCommends() {
// 	// Gets commends (for Dobby because tbh noone else cares about commends)
// 	// Input: username (optional)
// 	// Output: err, username, commends
// 	eventbus.on('user:getcommends', function(username) {
// 		// Get a specific users commends
// 		getCommends(username, function(err, amount) {
// 			if(!err) {
// 				eventbus.emit('chat:commends', err, username, amount);
// 			}
// 			else {
// 				eventbus.emit('error:issue', 'Error setting comments');
// 			}
// 		});
// 	});
// }

// var getCommends = function getCommends(username, callback) {
// 	// Get Commends - Retrieves a user's commends
// 	db.get().hget('user:' + username, 'commends', function(err, data) {
// 		if(!err) {
// 			callback(err, data);
// 		}
// 	});
// };

module.exports = {
	start: start
};
