/* Test for lib/user.js */

var assert = require('chai').assert;
var sinon = require('sinon');

var db = require('../../lib/db');
db.connect('mode_staging');	// Do not remove this or you will wipe your data

var EventEmitter = require('events');
var eventbus = new EventEmitter;	// Temporary event bus to prevent events firing across files

var User = require('.');
User.start(db, eventbus);

describe('Users', function() {
	beforeEach(function(done) {
		// Wipe database before running tests. Note: Make _SURE_ you are on staging
		db.get().flushdb(function(err) {
			if(!err) {
				done();
			}
		});
	});
	describe('getHouse', function() {
		it('returns a house for a valid user', function(done) {
			var username = 'bdickason';

			var _err = null;
			var _house = 'Gryffindor';

			db.get().hset('user:' + username, 'house', 'Gryffindor', function(err, data) {
				User.getHouse(username, function(err, house) {
					assert.equal(err, _err);
					assert.equal(house, _house);
					done();
				});
			});
		});
		it('returns null for a user that doens\'t have a house set', function(done) {
			var username = 'bdickason';

			var _err = null;
			var _house = null;

			db.get().hset('user:' + username, 'uid', '0', function(err, data) {
				User.getHouse(username, function(err, house) {
					assert.equal(err, _err);
					assert.equal(house, _house);
					done();
				});
			});
		});
		it('returns an error if no user is passed in', function(done) {
			var username = null;

			var _err = 'no user provided';
			var _house = null;

			User.getHouse(username, function(err, house) {
				assert.equal(err, _err);
				assert.equal(house, null);
				done();
			});
		});
	});
	describe('getHouseMembers', () => {
		beforeEach((done) => {
			// Add a few users to houses
			db.get().sadd('houses:Gryffindor', 'bdickason', (err, success) => {
				db.get().sadd('houses:Gryffindor', 'teamalea', (err, success) => {
					db.get().sadd('houses:Slytherin', 'larry_manalo', (err, success) => {
						if(!err) {
							done()
						}
					})
				})
			})
		})
		it('Returns all members of a house with multiple members', function(done) {
			var house = 'Gryffindor';

			var _err = null;
			var _users = ['teamalea','bdickason'];

			User.getHouseMembers(house, (err, users) => {
				assert.equal(err, _err);
				assert.deepEqual(users, _users);
				done();
			});
		});
		it('Returns all members of a house with a single member', function(done) {
			var house = 'Slytherin';

			var _err = null;
			var _users = ['larry_manalo'];

			User.getHouseMembers(house, (err, users) => {
				assert.equal(err, _err);
				assert.deepEqual(users, _users);
				done();
			});
		});
		it('Returns nothing for a house with no members', function(done) {
			var house = 'Ravenclaw';

			var _err = null;
			var _users = [];

			User.getHouseMembers(house, (err, users) => {
				assert.equal(err, _err);
				assert.deepEqual(users, _users);
				done();
			});
		});
		it('Errors if no house is provided', function(done) {
			var house = null;

			var _err = 'no house provided';
			var _users = null;

			User.getHouseMembers(house, (err, users) => {
				assert.equal(err, _err);
				assert.equal(users, _users);
				done();
			});
		});
		it('Errors if a full house name is not provided', function(done) {
			var house = 'g';

			var _err = 'please provide a valid full house name';
			var _users = null;

			User.getHouseMembers(house, (err, users) => {
				assert.equal(err, _err);
				assert.equal(users, _users);
				done();
			});
		});
	});
	describe('setHouse', function() {
		it('sets a random house for an existing user', function(done) {
			var username = 'bdickason';

			var _err = null;
			var _houses = ['Gryffindor', 'Slytherin', 'Hufflepuff', 'Ravenclaw'];;

			db.get().hset('user:' + username, 'uid', 0, function(err, data) {
				User.setHouse(username, function(err, house) {
					assert.equal(err, _err);
					assert.include(_houses, house);
					done();
				});
			});
		});
		it('returns an error if no user is passed in', function(done) {
			var username = null;

			var _err = 'no user provided';
			var _house = null;

			User.getHouse(username, function(err, house) {
				assert.equal(err, _err);
				assert.equal(house, null);
				done();
			});
		});
	});
	describe('exists', function() {
		it('returns true if a user has a uid', function(done) {
			var username = 'bdickason';

			var _err = null;
			var _exists = true;

			db.get().hset('user:' + username, 'uid', 0, function(err, data) {
				User.exists(username, function(err, exists) {
					assert.equal(err, _err);
					assert.equal(exists, _exists);
					done();
				});
			});
		});
		it('returns false for a user that doens\'t exist (no uid)', function(done) {
			var username = 'bdickason';

			var _err = null;
			var _exists = false;

			User.exists(username, function(err, exists) {
				assert.equal(err, _err);
				assert.equal(exists, _exists);
				done();
			});

		});
		it('returns an error if no user is passed in', function(done) {
			var username = null;

			var _err = 'no user provided';
			var _exists = null;

			User.exists(username, function(err, exists) {
				assert.equal(err, _err);
				assert.equal(exists, _exists);
				done();
			});
		});
	});
	describe('create', function() {
		it('User doesn\'t exist: Creates a user and returns the username', function(done) {
			var username = 'bdickason';

			var _err = null;
			var _user = 'bdickason';

			var _data = {
				uid: 0,
				house: 'muggle',
				username: 'bdickason'
			};

			User.create(username, function(err, user) {
				assert.equal(err, _err);
				assert.equal(user, _user);

				db.get().hgetall('user:' + username, function(err, data) {

					assert.equal(data.uid, _data.uid);
					assert.equal(data.house, _data.house);

					db.get().hkeys('users', function(err, data) {
						// Make sure we're populating the list of users
						assert.include(data, _data.username);
						done();
					})
				})
			});
		});
		it('User exists: Return error', function(done) {
			var username = 'bdickason';

			var _err = 'User already exists';
			var _user = null;

			db.get().hset('user:' + username, 'uid', 0, function(err, data) {
				User.create(username, function(err, user) {
					assert.equal(err, _err);
					assert.equal(user, _user);
					done();
				});
			});

		});
		it('returns an error if no user is passed in', function(done) {
			var username = null;

			var _err = 'no user provided';
			var _exists = null;

			User.create(username, function(err, exists) {
				assert.equal(err, _err);
				assert.equal(exists, null);
				done();
			});
		});
	});
	describe('getCommends', function() {
		it('User not found: Returns error', function(done) {
			var username = 'blah';

			var _err = 'User Not Found';
			var _commends = null;

			User.getCommends(username, function(err, commends) {
				assert.equal(err, _err);
				assert.equal(commends, _commends);
				done();
			});
		});
		it('User found but no commends: Returns error', function(done) {
			var username = 'bdickason';

			var _err = 'User Has No Commends';
			var _commends = null;

			User.create(username, function(err, user) {
				// Create dummy user but don't set commends
				User.getCommends(username, function(err, commends) {
					assert.equal(err, _err);
					assert.equal(commends, _commends);
					done();
				});
			})
		});
		it('Returns commends for a user with commends', function(done) {
			var username = 'bdickason';
			var commends = 53;

			var _err = null;
			var _commends = 53;

			User.create(username, function(err, user) {
				db.get().hset('user:' + username, 'commends', commends, function(err, data) {
					User.getCommends(username, function(err, commends) {
						assert.equal(err, _err);
						assert.equal(commends, _commends);
						done();
					});
				})
			})
		});
	});
	describe('setCommends', function() {
		it('No user passed: Returns error', function(done) {
			var username = null;

			var _err = 'no user provided';
			var _commends = null;

			User.getCommends(username, function(err, commends) {
				assert.equal(err, _err);
				assert.equal(commends, _commends);
				done();
			});
		});

		it('User not found: Returns error', function(done) {
			var username = 'blah';

			var _err = 'User Not Found';
			var _commends = null;

			User.getCommends(username, function(err, commends) {
				assert.equal(err, _err);
				assert.equal(commends, _commends);
				done();
			});
		});
		it('User found but no commends: Returns error', function(done) {
			var username = 'bdickason';

			var _err = 'User Has No Commends';
			var _commends = null;

			User.create(username, function(err, user) {
				// Create dummy user but don't set commends
				User.getCommends(username, function(err, commends) {
					assert.equal(err, _err);
					assert.equal(commends, _commends);
					done();
				});
			})
		});
		it('Commends saved successfully', function(done) {
			var username = 'bdickason';
			var commends = 53;

			var _err = null;
			var _commends = 53;

			User.create(username, function(err, user) {
				db.get().hset('user:' + username, 'commends', commends, function(err, data) {
					User.getCommends(username, function(err, commends) {
						assert.equal(err, _err);
						assert.equal(commends, _commends);
						done();
					});
				})
			})
		});
	});
	describe('getAll', function() {
		it('User not found: Returns error', function(done) {
			var username = 'blah';

			var _err = 'User Not Found';
			var _data = null;

			User.getAll(username, function(err, data) {
				assert.equal(err, _err);
				assert.equal(data, _data);
				done();
			});
		});
		it('Returns status for a user with house and no commends', function(done) {
			var username = 'bdickason';
			var house = 'muggle';

			var _err = null;
			var _data = {
				'uid': '0',
				'house': 'muggle'
			};

			User.create(username, function(err, user) {
				db.get().hset('user:' + username, 'house', house, function(err, data) {
					User.getAll(username, function(err, data) {
						assert.equal(err, _err);
						assert.deepEqual(data, _data);
						done();
					});
				});
			});
		});
		it('Returns status for a user with house and no commends', function(done) {
			var username = 'bdickason';
			var house = 'muggle';
			var commends = 53;

			var _err = null;
			var _data = {
				'uid': '0',
				'house': 'muggle',
				'commends': '53'
			};

			User.create(username, function(err, user) {
				db.get().hmset('user:' + username, 'house', house, 'commends', commends, function(err, data) {
					User.getAll(username, function(err, data) {
						assert.equal(err, _err);
						assert.deepEqual(data, _data);
						done();
					});
				});
			});
		});
		it('No user passed in: Returns error', function(done) {
			var username = null;

			var _err = 'no user provided';
			var _data = null;

			User.getAll(username, function(err, data) {
				assert.equal(err, _err);
				assert.equal(data, _data);
				done();
			});
		});
		describe('Pick a random House', function() {
			it('Has an even distribution of randomness', function(done) {

				var outcomes = {
					Gryffindor: 0,
					Ravenclaw: 0,
					Hufflepuff: 0,
					Slytherin: 0
				};

				for(var i=0; i < 10000; i++) {
					var random = User.generateHouse();
					outcomes[random]++;
				}

				assert.isAtLeast(outcomes.Gryffindor, 2300);
				assert.isAtLeast(outcomes.Ravenclaw, 2300);
				assert.isAtLeast(outcomes.Hufflepuff, 2300);
				assert.isAtLeast(outcomes.Slytherin, 2300);

				done();

			});
		});
		describe('sanitize() - Sanitize Username', function() {
			it('letters - Keeps it in', function() {
				var username = 'bdickason';

				var _result = 'bdickason';

				var result = User.sanitize(username);

				assert.equal(result, _result);
			});
			it('_ - Keeps it in', function() {
				var username = 'larry_manalo';

				var _result = 'larry_manalo';

				var result = User.sanitize(username);

				assert.equal(result, _result);

			});
			it(': - Strips it out', function() {
				var username = 'b:dickason';

				var _result = 'bdickason';

				var result = User.sanitize(username);

				assert.equal(result, _result);
			})
		})
	});
});
