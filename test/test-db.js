/* Tests for db.js */

var assert = require('assert');

var db = require('../lib/db.js');

describe('Database', function() {
	it('Connects to redis without throwing an error', function() {
		var _type = {};

		db.connect();	
		var dbInfo = db.get().info();

		assert.equal(typeof(_type), typeof(dbInfo));
	});
});
