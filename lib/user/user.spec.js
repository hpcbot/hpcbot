/* Test for lib/user.js */

var assert = require('chai').assert;
var eventbus = require('../eventbus');
var strings = require('../../config/strings.json');

var db = require('../db');
db.connect('mode_staging');	// Do not remove this or you will wipe your data

var User = require('.');
var user = User.start(db);

describe('Users', function() {
	it('Throws an error if no db is passed in', function() {
		var _err = "Database not found";
		try {
			User.start();
		} 
		catch (err) {
			assert.equal(err, _err);
		}
	});

	beforeEach(function(done) {
		// Wipe database before running tests. Note: Make _SURE_ you are on staging
		db.get().flushdb(function(err) {
			if(!err) {
				done();
			}
		});
	});

	it('add: Creates a new user if one doesn\'t exist', function(done) {
		var _err = null;
		var _username = 'bdickason';
		var _uid = '1';
		var _house = 'muggle';

		eventbus.once('say:added', function(response) {
			db.get().hgetall('user:bdickason', function(err, items) {
				assert.equal(_err, err);
				assert.equal(_uid, items.uid);
				assert.equal(_house, items.house);
				done();	
			});
		});
		eventbus.emit('twitch:join', _username);

	});

	it('add: Doesn\'t create a new user if one exists', function(done) {
		var _err = null;
		var _username = 'bdickason';
		var _uid = 1;
		var _house = 'muggle';
		var _response = strings.join.welcome + _username + strings.join.new_here

		eventbus.once('say:added', function(response) {
			db.get().hgetall('user:bdickason', function(err, items) {
				assert.equal(_err, err);
				assert.equal(_uid, items.uid);
				assert.equal(_house, items.house);
				assert.equal(_response, response);

				_err = "User already exists";

				eventbus.emit('twitch:join', 'bdickason');

				eventbus.once('error:exists', function(err) {
					// Duplicate join events should lead to a duplicate error being triggered
					assert.equal(err, _err);
					done();
				});
			});
		});

		eventbus.emit('twitch:join', _username);
	});

	it('sort: Sorts new users', function(done) {
		var username = 'bdickason';

		var _err = null;
		var _items = {};	// user:bdickason shoudl have no keys

		var _string = strings.house.proud_member_of.split(' ');
		var _houses = ['Gryffindor', 'Slytherin', 'Hufflepuff', 'Ravenclaw'];

		eventbus.once('say:sorted', function(response) {	
			var line = response.toString().split(' ');
			assert.equal(line[0], username);
			assert.equal(line[1], _string[1]);
			assert.include(_houses, line[7]);
			done();
		});

		db.get().hgetall('user:bdickason', function(err, items) {
			assert.equal(_err, err);
			assert.deepEqual(items, {});

			eventbus.emit('user:sort', username);
		});
	});

	it('sort: Sorts existing users', function(done) {
		var username = 'bdickason';

		var _err = null;
		var _uid = 1;
		var _emptyHouse = 'muggle';

		var _string = strings.house.proud_member_of.split(' ');
		var _houses = ['Gryffindor', 'Slytherin', 'Hufflepuff', 'Ravenclaw'];

		eventbus.once('say:sorted', function(response) {	
			var line = response.toString().split(' ');
			assert.equal(line[0], username);
			assert.equal(line[1], _string[1]);
			assert.include(_houses, line[7]);
			done();
		});

		// Make sure user is actually created
		eventbus.once('say:added', function(response) {
			db.get().hgetall('user:' + username, function(err, items) {
				assert.equal(_err, err);
				assert.equal(_uid, items.uid);
				assert.equal(_emptyHouse, items.house);

				eventbus.emit('user:sort', username);

			});
		});

		// User.add('bdickason', function(err, username) {
		// 	assert.equal(err, null);
		// 	assert.equal(username, 'bdickason');
		// 	User.house(username, function(err, house) {
		// 		assert.equal(err, null);	// User shouldn't already have a house
		// 		assert.equal(house, _emptyHouse);
		// 		User.sorting(username, function(err, house) {
		// 			assert.equal(err, _err);
		// 			assert.notEqual(house, _notHouse);
		// 			assert.include(_houses, house);
		// 			done();
		// 		});
		// 	});


			eventbus.emit('twitch:join', username);

	});

	it('house: Can check house of a muggle (no house set)', function(done) {
		var username = "bdickason";

		var _err = null;
		var _house = 'muggle';

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
