/* Test for house.js */

var assert = require('chai').assert;
var sinon = require('sinon');

var strings = require('../../../config/strings.json');

var EventEmitter = require('events');
var eventbus = new EventEmitter;	// Temporary event bus to prevent events firing across files

var house;

var user;

describe('House', function() {
	beforeEach(function() {
	    this.sinon = sandbox = sinon.sandbox.create();

		// Stub out User
		User = require('../../models/user');
		getStub = this.sinon.stub(User, 'getHouse');
		setStub = this.sinon.stub(User, 'setHouse');
		existsStub = this.sinon.stub(User, 'exists');
		createStub = this.sinon.stub(User, 'create');

		var House = require('.');
		house = House.start(eventbus, User);
	});
	describe('Get a user\'s house', function() {
		it('User Not Found: Returns invalid user', function(done) {
			var username = 'bdickason';
			var parameters = null;

			var _err = null;
			var _username = "bdickason";
			var _string = strings.house.cannot_find;

			// Setup stub for our User dependency
			getStub.yields(null, null);

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

			// Setup stub for our User dependency
			getStub.yields(null, 'muggle');

			eventbus.once('twitch:say', function(response) {
				assert.equal(response.length, 1);	// There should only be one line in the response
				assert.include(response[0], _username);
				assert.include(response[0], _string);

				done();
			})

			eventbus.emit('house:get', username, parameters);
		});
		it('User has a house: Says user\'s house to chat', function(done) {
			var username = 'bdickason';
			var parameters = null;

			var _err = null;
			var _username = "bdickason";
			var _house = 'Gryffindor'
			var _string = strings.house.proud_member_of;

			// Setup stub for our User dependency
			getStub.yields(null, 'Gryffindor');	// hget should callback 'muggle' in this case


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

			// Setup stub for our User dependency
			getStub.yields(null, 'Gryffindor');	// hget should callback 'muggle' in this case

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
		it('New User (non-muggle): Tells channel user is sorted', function(done) {
			var username = 'bdickason';

			var _string = strings.sorting.congrats + username + strings.sorting.joined_house;
			var _house = 'Gryffindor';

			// Setup stub for our User dependency
			existsStub.yields(null, false);
			createStub.yields(null, 'bdickason');
			setStub.yields(null, 'Gryffindor');

			eventbus.once('twitch:say', function(response) {
				var houses = response.toString().split(' ');
				var house = houses[houses.length - 1 ];	// House should be the last word in the string

				assert.equal(response.length, 1);	// There should only be one line in the response
				assert.include(response[0], _string);
				assert.equal(_house, house);

				done();
			});

			eventbus.emit('house:set', username);
		});
		it('New User (non-muggle): Triggers Twitch overlay', function(done) {
			var username = 'bdickason';

			var _payload = {
				username: 'bdickason',
				house_text: 'Gryffindor',
				house_image: 'house/images/gryffindor.png',
				house_audio: 'house/audio/gryffindor.m4a',
				delay: 8000
			}
			var _house = 'Gryffindor';

			// Setup stub for our User dependency
			existsStub.yields(null, false);
			createStub.yields(null, 'bdickason');
			setStub.yields(null, 'Gryffindor');

			eventbus.once('stream:house', function(payload) {
				assert.deepEqual(_payload, payload);
				done();
			});

			eventbus.emit('house:set', username);
		});
		it('Existing User (Muggle): Successfully sorts user into a house', function(done) {
			var username = 'bdickason';

			var _string = strings.sorting.congrats + username + strings.sorting.joined_house;
			var _house = 'Gryffindor';

			// Setup stub for our User dependency
			existsStub.yields(null, true);
			getStub.yields(null, 'muggle');
			setStub.yields(null, 'Gryffindor');

			eventbus.once('twitch:say', function(response) {
				var houses = response.toString().split(' ');
				var house = houses[houses.length - 1 ];	// House should be the last word in the string

				assert.equal(response.length, 1);	// There should only be one line in the response
				assert.include(response[0], _string);
				assert.include(_house, house);

				done();
			});

			eventbus.emit('house:set', username);
		});
		it('User already sorted', function(done) {
			var username = 'bdickason';

			var _string = strings.sorting.user_already_sorted;

			// Setup stub for our User dependency
			existsStub.yields(null, true);
			getStub.yields(null, 'Hufflepuff');

			eventbus.once('twitch:say', function(response) {
				assert.equal(response.length, 1);	// There should only be one line in the response
				assert.include(response[0], _string);

				done();
			});

			eventbus.emit('house:set', username);
		});
	});
	describe('Tests the sortinghat overlay', function() {
		it('Sends a valid event to overlay server', function(done) {
			var username = 'bdickason';

			var _string = strings.sorting.congrats + username + strings.sorting.joined_house;

			var _houses = ['Gryffindor', 'Slytherin', 'Ravenclaw', 'Hufflepuff'];

			eventbus.once('twitch:whisper', function(username, response) {

				var houses = response.toString().split(' ');
				var house = houses[houses.length - 1 ];	// House should be the last word in the string
				assert.include(_houses, house);

				assert.equal(response.length, 1);	// There should only be one line in the response
				assert.include(response[0], _string);

				done();
			});

			eventbus.emit('house:test', username);
		});
	});
	afterEach(function() {
	    sandbox.restore();
	});
});
