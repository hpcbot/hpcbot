/* join.js - Listen to a user joining the chat and create a new user for them
*/

var strings = require('../../../config/strings.json');

var eventbus; // Global event bus that modules can pub/sub to
var User;

var start = function start(_eventbus, _User) {
	eventbus = _eventbus;
	User = _User

	eventbus.on('user:join', addUser);
};

var addUser = function addUser(users) {
	// When a user joins the channel, we should see if they're a new user and if so, try to add them.
	// Input: Array of usernames (i.e. ['bdickason', 'teamalea'])
	var response = [];

	users.forEach(function(username) {
		// Check if anything exists at user:bdickason
		User.exists(username, function(err, exists) {
			if(!exists) {
				User.create(username, function(err, user) {
					if(!err) {
						line = strings.join.welcome + user + strings.join.new_here;
						response.push(line);
						eventbus.emit('twitch:say', response);
					}
					else {
						console.log("Error: " + err);
					}
				})
			}
		});

		// Add user to active users table
	});
};



module.exports = {
	start: start
};
