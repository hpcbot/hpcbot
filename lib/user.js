/* user.js - Users in our channel */

var db = require('../lib/db.js');

module.exports = {
	all: function(callback) {
		// Get a list of all users
		db.get().smembers("users:all", function(err, items) {
			callback(items);
		});
	},
	add: function(username, response) {
		// Check if user exists in all
		// If so, ignore
		// If not:
		// * Increment user:uids
		// * Add user at user:(uid)
		// Callback success
	}
}
