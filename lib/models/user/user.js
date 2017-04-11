/* user.js - Users in our channel */

var db;
var eventbus;

var start = function start(_eventbus, _db) {
	// Creates the user module
	// Input: db - pass in the db module

	eventbus = _eventbus;		
	db = _db;

};

module.exports = {
	start: start
};
