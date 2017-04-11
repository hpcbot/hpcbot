/* join.js - Listen to a user joining the chat and create a new user for them
*/

var strings = require('../../../config/strings.json');

var eventbus; // Global event bus that modules can pub/sub to
var db;

var start = function start(_eventbus, _db) {
	eventbus = _eventbus;
	db = _db;

	eventbus.on('user:join', addUser);
};

var addUser = function addUser(username) {
	// When a user joins the channel, we should see if they're a new user and if so, try to add them.
	var response = [];

	// Check if anything exists at user:bdickason
	db.get().hgetall('user:' + username, function(err, items) {

		var error = null;	// In case we need to throw our own error
		if(!err) {

			var isEmpty = (Object.keys(items).length === 0)	// Hack to check for empty object
			if(isEmpty) {

				userAdd(username, function(err, user) {
					if(!err) {
						line = strings.join.welcome + username + strings.join.new_here;
						response.push(line);
						eventbus.emit('twitch:say', response);
					}
					else {
						console.log("Error: " + err);
					}
				});
			}
		}
	});
};

var userAdd = function userAdd(username, callback) {
	// TODO - Refactor this into standalone user model
	// userAdd - Adds a user to the db
	// Input: username
	// Output: err, username

	// Find the next available unique identifier
	db.get().incr('user:uids', function(err, num) {
		var uid = num-1;	// Return the actual available uid, not the one after
		if(!err) {
			// add user to users hash
			// Users default to muggle until they're sorted
			db.get().hmset('user:' + username, 'uid', uid, 'house', 'muggle', function(err, data) {
				if(!err) {
					// add userto list of uids
					db.get().hset('users', username, uid, function(err, data) {
						if(!err) {
							console.log(username);
							callback(err, username);	// Return username if successful							
						}
						else {
							callback(err, null);
						}
					});
				} else {
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
	start: start
};