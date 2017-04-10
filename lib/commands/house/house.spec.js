/* Test for rules.js */

var assert = require('chai').assert;
var sinon = require('sinon');

var strings = require('../../../config/strings.json');

var EventEmitter = require('events');
var eventbus = new EventEmitter;	// Temporary event bus to prevent events firing across files

var db = require('../../db');
db.connect('mode_staging');	// Do not remove this or you will wipe your data
var dbStub = sinon.stub(db, 'get');

var House = require('.');
var house = House.start(eventbus, dbStub);




describe('House', function() {
	describe('Get a user\'s house', function() {
		it('User Not Found: Returns invalid user', function(done) {
			var username = 'bdickason';
			var parameters = null;

			var _err = null;
			var _username = "bdickason";
			var _string = strings.house.cannot_find;

			// Setup stub for our DB dependency
			var hgetStub = sinon.stub();		// Create a stub for the hget function (db.get().hget)
			dbStub.hget = hgetStub;
			hgetStub.yields(null, null);	// hget should callback 'muggle' in this case

			eventbus.once('twitch:say', function(response) {
				assert.equal(response.length, 1);	// There should only be one line in the response
				assert.include(response[0], _username);
				assert.include(response[0], _string);

				done();
			})

			eventbus.emit('house:get', username, parameters);
		});
		it('User is a muggle: Returns custom muggle string', function(done) {
			var username = 'bdickason';
			var parameters = null;

			var _err = null;
			var _username = 'bdickason';
			var _string = strings.house.muggle;

			// Setup stub for our DB dependency
			var hgetStub = sinon.stub();		// Create a stub for the hget function (db.get().hget)
			dbStub.hget = hgetStub;	
			hgetStub.yields(null, 'muggle');	// hget should callback 'muggle' in this case

			eventbus.once('twitch:say', function(response) {
				assert.equal(response.length, 1);	// There should only be one line in the response
				assert.include(response[0], _username);
				assert.include(response[0], _string);

				done();
			})

			eventbus.emit('house:get', username, parameters);
		});
		it('User has a house: Returns proper house string', function(done) {
			var username = 'bdickason';
			var parameters = null;

			var _err = null;
			var _username = "bdickason";
			var _house = 'Gryffindor'
			var _string = strings.house.proud_member_of;

			// Setup stub for our DB dependency
			var hgetStub = sinon.stub();		// Create a stub for the hget function (db.get().hget)
			dbStub.hget = hgetStub;
			hgetStub.yields(null, 'Gryffindor');	// hget should callback 'muggle' in this case

			eventbus.once('twitch:say', function(response) {
				assert.equal(response.length, 1);	// There should only be one line in the response
				assert.include(response[0], _username);
				assert.include(response[0], _string);
				assert.include(response[0], _house);

				done();
			})

			eventbus.emit('house:get', username, parameters);
		});
		it('User asks about another user: Returns proper house string', function(done) {
			var username = 'bdickason';
			var parameters = 'teamalea';

			var _err = null;
			var _username = 'teamalea';
			var _house = 'Gryffindor'
			var _string = strings.house.proud_member_of;

			// Setup stub for our DB dependency
			var hgetStub = sinon.stub();		// Create a stub for the hget function (db.get().hget)
			dbStub.hget = hgetStub;
			hgetStub.yields(null, 'Gryffindor');	// hget should callback 'muggle' in this case

			eventbus.once('twitch:say', function(response) {
				assert.equal(response.length, 1);	// There should only be one line in the response
				assert.include(response[0], _username);
				assert.include(response[0], _string);
				assert.include(response[0], _house);

				done();
			})

			eventbus.emit('house:get', username, parameters);
		});
	});
	describe('Set a user\'s house', function() {
		it('New User (non-muggle): Successfully sorts user into a house', function(done) {
			var username = 'bdickason';
			
			var _string = strings.sorting.congrats + username + strings.sorting.joined_house;
			var _houses = ['Gryffindor', 'Slytherin', 'Hufflepuff', 'Ravenclaw'];

			// Setup stub for hgetall
			var hgetallStub = sinon.stub();		// Create a stub for the hget function (db.get().hget)
			dbStub.hgetall = hgetallStub;
			
			var tmpUser = {};	// Returns empty set
			hgetallStub.yields(null, tmpUser);

			// Setup stub for hset
			var hsetStub = sinon.stub();		// Create a stub for the hset function (db.get().hset)
			dbStub.hset = hsetStub;
			
			hsetStub.yields(null, 0);	// Returns no error and empty set

			// Setup stub for sadd (remove when refactoring user model)
			var saddStub = sinon.stub();		// Create a stub for the sadd function (db.get().sadd)
			dbStub.sadd = saddStub;

			saddStub.yields(null, 0);	// Returns no error and empty set


			eventbus.once('twitch:say', function(response) {
				var houses = response.toString().split(' ');
				var house = houses[houses.length - 1 ];	// House should be the last word in the string

				assert.equal(response.length, 1);	// There should only be one line in the response
				assert.include(response[0], _string);
				assert.include(_houses, house);
				
				done();
			});

			eventbus.emit('house:set', username);
		});
		it('Existing User (Muggle): Successfully sorts user into a house', function(done) {
			var username = 'bdickason';
			
			var _string = strings.sorting.congrats + username + strings.sorting.joined_house;
			var _houses = ['Gryffindor', 'Slytherin', 'Hufflepuff', 'Ravenclaw'];

			// Setup stub for hgetall
			var hgetallStub = sinon.stub();		// Create a stub for the hget function (db.get().hget)
			dbStub.hgetall = hgetallStub;
			
			var tmpUser = {
				"uid": 0,
				"house": "muggle"	// User is a member but hasn't been sorted
			};
			hgetallStub.yields(null, tmpUser);

			// Setup stub for hset
			var hsetStub = sinon.stub();		// Create a stub for the hset function (db.get().hset)
			dbStub.hset = hsetStub;
			
			hsetStub.yields(null, 0);	// Returns no error and empty set

			// Setup stub for sadd (remove when refactoring user model)
			var saddStub = sinon.stub();		// Create a stub for the sadd function (db.get().sadd)
			dbStub.sadd = saddStub;

			saddStub.yields(null, 0);	// Returns no error and empty set


			eventbus.once('twitch:say', function(response) {
				var houses = response.toString().split(' ');
				var house = houses[houses.length - 1 ];	// House should be the last word in the string

				assert.equal(response.length, 1);	// There should only be one line in the response
				assert.include(response[0], _string);
				assert.include(_houses, house);
				
				done();
			});

			eventbus.emit('house:set', username);
		});
		it('User already sorted', function(done) {
			var username = 'bdickason';
			
			var _string = strings.sorting.user_already_sorted;

			// Setup stub for our DB dependency
			var hgetallStub = sinon.stub();		// Create a stub for the hget function (db.get().hget)
			dbStub.hgetall = hgetallStub;
			var tmpUser = {
				"uid": 0,
				"house": "hufflepuff"	// User is already a member of a house
			};
			hgetallStub.yields(null, tmpUser);	

			eventbus.once('twitch:say', function(response) {
				assert.equal(response.length, 1);	// There should only be one line in the response
				assert.include(response[0], _string);
				
				done();
			});

			eventbus.emit('house:set', username);
		});
	});
	after(function() {
		dbStub.restore();	// Remove our stub so the function works normally
	});


});
