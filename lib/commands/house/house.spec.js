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

	// User asks for their own house - returns a house
	// User asks for another house - returns another house
	// User has no house set - returns muggle
	// User has house set - returns house

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

	after(function() {
		dbStub.restore();	// Remove our stub so the function works normally
	})
});
	// it('house: Can check house of a sorted user (with a house)', function(done) {
	// 	var _username = "bdickason";

	// 	var _err = null;
	// 	var _houses = ['Gryffindor', 'Slytherin', 'Hufflepuff', 'Ravenclaw'];

	// 	eventbus.once('chat:sorted', function(username) {
	// 		eventbus.once('chat:house', function(err, username, house) {
	// 			assert.equal(_err, err);
	// 			assert.equal(_username, username);
	// 			assert.include(_houses, house);
	// 			done();
	// 		});
	// 		eventbus.emit('user:house', _username);
	// 	});

	// 	eventbus.emit('user:sort', _username);	// Sort the user first so they have a house
	// });
	

	// it('house: Responds with an error when a user doesn\'t exist', function(done) {
	// 	var _username = "bdonkason"

	// 	var _err = "User not found";
	// 	var _house = null;

	// 	eventbus.once('chat:house', function(err, username, house) {
	// 		assert.equal(err, _err);
	// 		assert.equal(username, _username);

	// 		assert.equal(house, _house);
	// 		done();
	// 	});

	// 	eventbus.emit('user:house', _username);
	// });