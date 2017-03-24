/* user.js - Users in our channel */

var db = require('../lib/db.js');

module.exports = {
	all: function(callback) {
		// Get a list of all users
		// input: (none)
		// output: ['bdickason']
		db.get().hkeys('users', function(err, items) {
			callback(items);
		});
	},
	ids: function(callback) {
		// Get a list of all user id's
		// input: (none)
		// output: ['1']
		db.get().hvals('users', function(err, items) {
			callback(items);
		});
	},
	id: function(username, callback) {
		// Get a single user's id
		// input: bdickason
		// output: ['1']
		db.get().hget('user:' + username, 'uid', function(err, items) {
			callback(items);
		})
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
