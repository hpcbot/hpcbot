/* Test for commends.js */

var assert = require('chai').assert;
var sinon = require('sinon');

var strings = require('../../../config/strings.json');

var EventEmitter = require('events');
var eventbus = new EventEmitter;	// Temporary event bus to prevent events firing across files

var Status;
var User;



describe('Commends', function() {
	beforeEach(function() {
	    this.sinon = sandbox = sinon.sandbox.create();

		// Stub out User
		User = require('../../models/user');
		getAllStub = this.sinon.stub(User, 'getAll');

		Status = require('.');
		Status.start(eventbus, User);
	});
	describe('Chat Triggers', function() {
		it('Contains settings for !status', function() {
			assert.notEqual(Status.triggers, null);
			assert.equal(Status.triggers[0].name, 'status');
			assert.equal(Status.triggers[0].type, 'chat');
			assert.equal(Status.triggers[0].whitelist, null);
			assert.equal(Status.triggers[0].event, 'status:get');
		});

	});

	describe('Get a user\'s status', function() {
		it('User Not Found: Returns invalid user', function(done) {
			var username = 'bdickason';
			var parameters = null;

			var _username = "bdickason";
			var _string = strings.status.cant_find + _username;

			// Setup stub for our User dependency
			getAllStub.yields('User Not Found', null);

			eventbus.once('twitch:say', function(response) {
				assert.equal(response.length, 1);	// There should only be one line in the response
				assert.include(response[0], _username);
				assert.include(response[0], _string);

				done();
			})

			eventbus.emit('status:get', username, parameters);
		});
		it('User has status', function(done) {
			var username = 'bdickason';
			var parameters = null;

			var _username = "bdickason";
			var _string1 = strings.status.overview;

			var notString1 = strings.status.house;

			// Setup stub for our User dependency
			getAllStub.yields(null, {});

			eventbus.once('twitch:say', function(response) {
				assert.equal(response.length, 1);	// There should be two lines in the response
				assert.include(response[0], _username);
				assert.include(response[0], _string1);
				assert.notInclude(response[0], notString1);

				done();
			})

			eventbus.emit('status:get', username, parameters);
		});
		it('User has complete status', function(done) {
			var username = 'bdickason';
			var parameters = null;
			var data = {
				house: "Slytherin",
				commends: 53,
				gold: 3
			};

			var _username = "bdickason";
			var _string1 = strings.status.overview;
			var _string2 = strings.status.house;
			var _house = 'Slytherin';
			var _string3 = strings.status.commends;
			var _commends = 53;
			var _string4 = strings.status.gold;
			var _gold = 3;

			// Setup stub for our User dependency
			getAllStub.yields(null, data);

			eventbus.once('twitch:say', function(response) {
				assert.equal(response.length, 4);	// There should be three lines in the response
				assert.include(response[0], _username);
				assert.include(response[0], _string1);
				assert.include(response[1], _string2);
				assert.include(response[1], _house);
				assert.include(response[2], _string3);
				assert.include(response[2], _commends);
				assert.include(response[3], _string4);
				assert.include(response[3], _gold);


				done();
			})

			eventbus.emit('status:get', username, parameters);
		});
		it('User can request another user\'s status', function(done) {
			var username = 'bdickason';
			var parameters = 'teamalea';
			var data = {
				house: "Hufflepuff"
			};

			var _username = "teamalea";
			var _string1 = strings.status.overview;
			var _string2 = strings.status.house;
			var _house = 'Hufflepuff';
			var notString3 = strings.status.commends;

			// Setup stub for our User dependency
			getAllStub.yields(null, data);

			eventbus.once('twitch:say', function(response) {
				assert.equal(response.length, 2);	// There should be two lines in the response
				assert.include(response[0], _username);
				assert.include(response[0], _string1);
				assert.include(response[1], _string2);
				assert.include(response[1], _house);
				assert.notInclude(response[1], notString3);

				done();
			})

			eventbus.emit('status:get', username, parameters);
		});
	});
	afterEach(function() {
	    sandbox.restore();
	});
});
