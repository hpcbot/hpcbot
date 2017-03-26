/* db.js - Data store for our bot */

var Redis = require ('ioredis');

var state = {
	db: null
};

// Configure environments for testing vs. prod
var MODE_STAGING = "mode_staging";
var MODE_PRODUCTION = "mode_production";

exports.MODE_STAGING = MODE_STAGING;
exports.MODE_PRODUCTION = MODE_PRODUCTION;

exports.connect = function(mode) {
	state.db = new Redis();

	// Use a different db if testing
	if(mode == MODE_STAGING) {
		state.db.select(15);
	}
};

exports.get = function() {
	return state.db;
};