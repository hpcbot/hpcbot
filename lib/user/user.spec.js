/* Test for lib/user.js */

var assert = require('chai').assert;
var eventbus = require('../eventbus');

var User = require('.');

var db = require('../db');
db.connect('mode_staging');	// Do not remove this or you will wipe your data




describe('Users', function() {
	beforeEach(function(done) {
		// Wipe database before running tests. Note: Make _SURE_ you are on staging
		db.get().flushdb(function(err) {
			if(!err) {
				done();
			}
		});
	});

	it('Throws an error if no db is passed in', function() {
		var _err = "Database not found";
		try {
			var user = User.start();
		} 
		catch (err) {
			assert.equal(err, _err);
		}
	});

	it('add: Creates a new user if one doesn\'t exist', function(done) {
		var _err = null;
		var _username = 'bdickason';
		var _uid = '1';
		var _house = 'muggle';

		var user = User.start(db);

		User.add('bdickason', function(err, username) {
			assert.equal(_err, err);
			assert.deepEqual(_username, username);

			db.get().hgetall('user:bdickason', function(err, items) {
				
				assert.equal(_err, err);
				assert.equal(_uid, items.uid);
				assert.equal(_house, items.house);
				done();	
			});
			
		});
	});

	it('add: Doesn\'t create a new user if one exists', function(done) {
		var _err = "User already exists"
		var _username = null;
		var _uid = null;
		var _house = null;

		var user = User.start(db);

		User.add('bdickason', function(err, username) {
			assert.equal(err, null);
			assert.equal(username, 'bdickason');
			User.add('bdickason', function(err, username) {
				assert.equal(err, _err);
				assert.equal(username, _username);
				done();
			});			
		});	
	});

	it('sort: Sorts new users', function(done) {
		var username = 'bdickason';

		var _err = null;
		var _items = {};	// user:bdickason shoudl have no keys

		var _notHouse = 'muggle';
		var _houses = ['Gryffindor', 'Slytherin', 'Hufflepuff', 'Ravenclaw'];

		var user = User.start(db);

		db.get().hgetall('user:bdickason', function(err, items) {
			assert.equal(_err, err);
			assert.deepEqual(items, {});

			User.sorting(username, function(err, house) {
				assert.equal(err, _err);
				assert.notEqual(house, _notHouse);
				assert.include(_houses, house);
				done();
			});

		});
	});

	it('sort: Sorts existing users', function(done) {
		var username = 'bdickason';

		var _err = null;
		var _emptyHouse = 'muggle';

		var _notHouse = 'muggle';
		var _houses = ['Gryffindor', 'Slytherin', 'Hufflepuff', 'Ravenclaw'];

		var user = User.start(db);

		User.add('bdickason', function(err, username) {
			assert.equal(err, null);
			assert.equal(username, 'bdickason');
			User.house(username, function(err, house) {
				assert.equal(err, null);	// User shouldn't already have a house
				assert.equal(house, _emptyHouse);
				User.sorting(username, function(err, house) {
					assert.equal(err, _err);
					assert.notEqual(house, _notHouse);
					assert.include(_houses, house);
					done();
				});
			});
		});
	});

	it('house: Can check house of a muggle (no house set)', function(done) {
		var username = "bdickason";

		var _err = null;
		var _house = 'muggle';

		var user = User.start(db);

		User.add('bdickason', function(err, users) {
			User.house(username, function(err, house) {
				assert.equal(err, _err);
				assert.equal(house, _house);
				done();
			});
		});
	});

	it('house: Can check house of a sorted user (with a house)', function(done) {
		var _err = null;

		var username = 'bdickason';

		var _notHouse = 'muggle';
		var _houses = ['Gryffindor', 'Slytherin', 'Hufflepuff', 'Ravenclaw'];

		var user = User.start(db);

		User.add('bdickason', function(err, username) {
			assert.equal(username, 'bdickason');

			User.sorting(username, function(err, userhouse) {
				assert.equal(err, null);

				User.house(username, function(err, house) {
					assert.equal(err, _err);
					assert.include(_houses, house);
					done();
				});

			});

		});
	});

	it('house: Responds with an error when a user doesn\'t exist', function(done) {
		var username = "bdonkason"

		var _err = "User not found";
		var _house = null;

		User.add('bdickason', function(err, users) {
			User.house(username, function(err, house) {
				assert.equal(err, _err);
				assert.equal(house, _house);
				done();
			});
		});
	});
});
