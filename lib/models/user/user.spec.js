/* Test for lib/user.js */

var assert = require('chai').assert;
var eventbus = require('../../eventbus');
var strings = require('../../../config/strings.json');

var db = require('../../db');
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
		var _uid = '0';
		var _house = 'muggle';

		// var _response = strings.join.welcome + _username + strings.join.new_here

		eventbus.once('chat:joined', function(username) {
			db.get().hgetall('user:bdickason', function(err, items) {
				assert.equal(_err, err);
				assert.equal(_uid, items.uid);
				assert.equal(_house, items.house);
				done();	
			});

		});
		eventbus.emit('user:join', _username);

	});

	it('add: Doesn\'t create a new user if one exists', function(done) {
		var _err = null;
		var _username = 'bdickason';
		var _uid = 0;
		var _house = 'muggle';
		var _response = strings.join.welcome + _username + strings.join.new_here

		eventbus.once('chat:joined', function(response) {
			db.get().hgetall('user:bdickason', function(err, items) {
				assert.equal(_err, err);
				assert.equal(_uid, items.uid);
				assert.equal(_house, items.house);

				_err = "User already exists";

				eventbus.once('error:exists', function(err) {
					// Duplicate join events should lead to a duplicate error being triggered
					assert.equal(err, _err);
					done();
				});

				eventbus.emit('user:join', 'bdickason');
			});
		});

		eventbus.emit('user:join', _username);
	});


	it('sort: Sorts new users', function(done) {
		var username = 'bdickason';
		var _username = 'bdickason';

		var _err = null;
		var _items = {};	// user:bdickason shoudl have no keys

		var _string = strings.house.proud_member_of.split(' ');
		var _houses = ['Gryffindor', 'Slytherin', 'Hufflepuff', 'Ravenclaw'];

		eventbus.once('chat:sorted', function(err, username, house) {
			assert.equal(_username, username);
			assert.include(_houses, house);

			done();
		});

		db.get().hgetall('user:bdickason', function(err, items) {
			// User should not exist
			assert.equal(_err, err);
			assert.deepEqual(items, {});

			eventbus.emit('user:sort', username);
		});
	});

	it('sort: Sorts existing users', function(done) {
		var _username = 'bdickason';

		var _err = null;
		var _uid = 0;
		var _emptyHouse = 'muggle';

		var _houses = ['Gryffindor', 'Slytherin', 'Hufflepuff', 'Ravenclaw'];

		// Make sure user is actually created
		eventbus.once('chat:joined', function(err, username) {
			db.get().hgetall('user:' + username, function(err, items) {
				assert.equal(_err, err);
				assert.equal(_uid, items.uid);
				assert.equal(_emptyHouse, items.house);

				eventbus.once('chat:sorted', function(err, name, house) {	
					assert.equal(_username, username);
					assert.include(_houses, house);

					done();
				});

				eventbus.emit('user:sort', username);
			});
		});
		
		eventbus.emit('user:join', _username);

	});


	it('sort: Doesn\'t sort existing sorted users', function(done) {
		var username = 'bdickason';

		var _err = null;
		var _uid = 1;
		var _emptyHouse = 'muggle';

		var _string = strings.house.proud_member_of.split(' ');
		var _houses = ['Gryffindor', 'Slytherin', 'Hufflepuff', 'Ravenclaw'];

		var _response = [strings.sorting.user_already_sorted];

		var _error = 'sorted';
		

		eventbus.once('chat:sorted', function(err, username, house) {
			eventbus.emit('user:sort', 'bdickason');

			eventbus.once('chat:sorted', function(err, username, house) {
				assert.equal(_error, 'sorted');
				assert.equal(house, null);
				done();
				// assert.deepEqual(_response, response);
				// done();
				
			});
		});

		eventbus.emit('user:sort', username);
	});

	it('house: Can check house of a muggle (no house set)', function(done) {
		var _username = "bdickason";

		var _err = null;
		var _house = 'muggle';

		eventbus.once('chat:joined', function(username) {
			eventbus.once('chat:house', function(err, username, house) {
				assert.equal(_err, err);
				assert.equal(_username, username);
				assert.equal(_house, house);
				done();
			});
			eventbus.emit('user:house', _username);
		});

		eventbus.emit('user:join', _username);
	});

	it('house: Can check house of a sorted user (with a house)', function(done) {
		var _username = "bdickason";

		var _err = null;
		var _houses = ['Gryffindor', 'Slytherin', 'Hufflepuff', 'Ravenclaw'];

		eventbus.once('chat:sorted', function(username) {
			eventbus.once('chat:house', function(err, username, house) {
				assert.equal(_err, err);
				assert.equal(_username, username);
				assert.include(_houses, house);
				done();
			});
			eventbus.emit('user:house', _username);
		});

		eventbus.emit('user:sort', _username);	// Sort the user first so they have a house
	});
	

	it('house: Responds with an error when a user doesn\'t exist', function(done) {
		var _username = "bdonkason"

		var _err = "User not found";
		var _house = null;

		eventbus.once('chat:house', function(err, username, house) {
			assert.equal(err, _err);
			assert.equal(username, _username);

			assert.equal(house, _house);
			done();
		});

		eventbus.emit('user:house', _username);
	});

	describe('setCommends', function() {
		it('No Parameters: Ignores', function(done) {
			var username = 'bdickason';
			var commends = null;
			var uid = 0;

			var _err = 'Error setting commends';
			var _username = 'bdickason';
			var _commends = null;
			var _uid = 0;


			eventbus.once('whisper:commendsset', function(err, username, amount) {
				// Make sure event is being triggered properly
				assert.equal(_err, err);
				assert.equal(_username, username);
				assert.equal(_commends, commends);
				db.get().hgetall('user:' + username, function(err, data) {
					// Make sure data is notstored in db
					assert.equal(_uid, data.uid);
					assert.equal(_commends, data.commends);
					done();
				});
			});
			db.get().hset('user:' + username, 'uid', uid, function(err, data) {
				if(!err) {
					eventbus.emit('user:setcommends', username, commends);
				}
			})
		});
				it('sets a users commends', function(done) {
			var username = 'bdickason';
			var commends = 53;
			var uid = 0;

			var _err = null;
			var _username = 'bdickason';
			var _commends = 53;
			var _uid = 0;


			eventbus.once('whisper:commendsset', function(err, username, amount) {
				// Make sure event is being triggered properly
				assert.equal(_err, err);
				assert.equal(_username, username);
				assert.equal(_commends, commends);
				db.get().hgetall('user:' + username, function(err, data) {
					// Make sure data is stored in db
					assert.equal(_err, err);
					assert.equal(_uid, data.uid);
					assert.equal(_commends, data.commends);
					done();
				});
			});
			db.get().hset('user:' + username, 'uid', uid, function(err, data) {
				if(!err) {
					eventbus.emit('user:setcommends', username, commends);
				}
			})
		});
	});
		describe('getCommends', function() {
		it('No Parameter: gets your commends', function(done) {
			var username = 'bdickason';
			var commends = 53;
			var uid = 0;

			var _err = null;
			var _username = 'bdickason';
			var _commends = '53';
			var _uid = 0;


			eventbus.once('chat:commends', function(err, username, amount) {
				// Make sure event is being triggered properly
				assert.equal(_err, err);
				assert.equal(_username, username);
				assert.equal(_commends, commends);
				done();
			});

			db.get().hmset('user:' + username, 'uid', uid, 'commends', commends, function(err, data) {
				if(!err) {
					eventbus.emit('user:getcommends', username);
				}
			})
		});
	});
});
