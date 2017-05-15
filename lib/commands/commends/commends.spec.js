/* Test for commends.js */

var assert = require('chai').assert;
var sinon = require('sinon');

var strings = require('../../../config/strings.json');

var EventEmitter = require('events');
var eventbus = new EventEmitter;	// Temporary event bus to prevent events firing across files

var commends;
var User;

describe('Commends', function() {
	beforeEach(function() {
	    this.sinon = sandbox = sinon.sandbox.create();

		// Stub out User
		User = require('../../models/user');
		getCommendsStub = this.sinon.stub(User, 'getCommends');
		setCommendsStub = this.sinon.stub(User, 'setCommends');

		var Commends = require('.');
		commends = Commends.start(eventbus, User);
	});
	describe('Get a user\'s commends', function() {
		it('User Not Found: Returns invalid user', function(done) {
			var username = 'bdickason';
			var parameters = null;

			var _username = "bdickason";
			var _string = strings.commends.cant_find + _username;

			// Setup stub for our User dependency
			getCommendsStub.yields('User Not Found', null);

			eventbus.once('twitch:say', function(response) {
				assert.equal(response.length, 1);	// There should only be one line in the response
				assert.include(response[0], _username);
				assert.include(response[0], _string);

				done();
			})

			eventbus.emit('commends:get', username, parameters);
		});
		it('User Has No Commends: Returns no commends message', function(done) {
			var username = 'bdickason';
			var parameters = null;

			var _username = "bdickason";
			var _string = _username + strings.commends.no_commends;

			// Setup stub for our User dependency
			getCommendsStub.yields('User Has No Commends', null);

			eventbus.once('twitch:say', function(response) {
				assert.equal(response.length, 1);	// There should only be one line in the response
				assert.include(response[0], _username);
				assert.include(response[0], _string);

				done();
			})

			eventbus.emit('commends:get', username, parameters);
		});
		it('User has commends and asks for themself', function(done) {
			var username = 'bdickason';
			var parameters = null;

			var _username = "bdickason";
			var _string1 = strings.commends.user_has;
			var _string2 = strings.commends.commends;
			var _commends = 53;

			var notString3 = strings.commends.jealous;

			// Setup stub for our User dependency
			getCommendsStub.yields(null, 53);

			eventbus.once('twitch:say', function(response) {
				assert.equal(response.length, 1);	// There should only be one line in the response
				assert.include(response[0], _username);
				assert.include(response[0], _string1);
				assert.include(response[0], _string2);
				assert.notInclude(response[0], notString3);
				assert.include(response[0], _commends);

				done();
			})

			eventbus.emit('commends:get', username, parameters);
		});
		it('User asks for someone else', function(done) {
			var username = 'bdickason';
			var parameters = 'teamalea';

			var _username = "teamalea";
			var _string1 = strings.commends.user_has;
			var _string2 = strings.commends.commends;
			var _string3 = strings.commends.jealous;
			var _commends = 53;

			// Setup stub for our User dependency
			getCommendsStub.yields(null, 53);

			eventbus.once('twitch:say', function(response) {
				assert.equal(response.length, 1);	// There should only be one line in the response
				assert.include(response[0], _username);
				assert.include(response[0], _string1);
				assert.include(response[0], _string2);
				assert.include(response[0], _string3);
				assert.include(response[0], _commends);

				done();
			})

			eventbus.emit('commends:get', username, parameters);
		});
	});
	describe('Set a user\'s commends', function() {
		it('Number: Commends Saved Successfully', function(done) {
			var username = 'bdickason';
			var parameters = 53;

			var _username = 'bdickason';
			var _string1 = strings.commends.saved;
			var _commends = 53;

			// Setup stub for our User dependency
			setCommendsStub.yields(null, 53);

			eventbus.once('twitch:whisper', function(username, response) {
				assert.equal(username, _username);

				assert.equal(response.length, 1);	// There should only be one line in the response
				assert.include(response[0], _string1);
				assert.include(response[0], _commends);

				done();
			});

			eventbus.emit('commends:set', username, parameters);
		});

		it('Non-Number: Error Saving Commends', function(done) {
			var username = 'bdickason';
			var parameters = 'teamalea';

			var _err = 'commends not a number';
			var _username = "bdickason";
			var _string1 = strings.commends.error;
			var _string2 = strings.commends.non_number;

			// Setup stub for our User dependency
			setCommendsStub.yields('commends not a number', null);

			eventbus.once('twitch:whisper', function(username, response) {
				assert.equal(username, _username);

				assert.equal(response.length, 1);	// There should only be one line in the response
				assert.include(response[0], _string1);
				assert.include(response[0], _string2);

				done();
			});

			eventbus.emit('commends:set', username, parameters);
		});

		it('No Parameter: Error Saving Commends', function(done) {
			var username = 'bdickason';
			var parameters = null;

			var _username = "bdickason";
			var _string1 = strings.commends.error;
			var _string2 = strings.commends.no_parameter;

			// Setup stub for our User dependency
			setCommendsStub.yields('no commends provided', null);

			eventbus.once('twitch:whisper', function(username, response) {
				assert.equal(username, _username);

				assert.equal(response.length, 1);	// There should only be one line in the response
				assert.include(response[0], _string1);
				assert.include(response[0], _string2);
				done();
			});

			eventbus.emit('commends:set', username, parameters);
		});
	});
	afterEach(function() {
	    sandbox.restore();
	});
});
