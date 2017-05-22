/* gold.js - A (fake!) resource that you can manage and earn :) */

var db;

var start = function start(_db) {
	// Creates the user module
	// Input: db - pass in the db module

	db = _db;
};

var give = function giveGold(username, callback) {
	// Give gold to a user
	// Input: username
	// Output: error, 'Gryffindor'
	if(username) {
		db.get().hget('user:' + username, 'house', function(err, house) {
			callback(err, house);
		});
	}
	else {
		callback('no user provided', null);
	}
};


module.exports = {
	start: start,
	give: give
};
