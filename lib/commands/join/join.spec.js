/* Test for join.js */

var assert = require('chai').assert;
var sinon = require('sinon');

var strings = require('../../../config/strings.json');

var EventEmitter = require('events');
var eventbus = new EventEmitter;	// Temporary event bus to prevent events firing across files

var join;
var User;


describe('Join', function() {
	beforeEach(function() {
	    this.sinon = sandbox = sinon.sandbox.create();

		// Stub out User
		User = require('../../models/user');
		existsStub = this.sinon.stub(User, 'exists');
		createStub = this.sinon.stub(User, 'create');

		var Join = require('.');
		join = Join.start(eventbus, User);
	});
	it('add: Creates a new user if one doesn\'t exist', function(done) {
		var _users = ['bdickason'];
		var _response = strings.join.welcome + _users[0] + strings.join.new_here;

		// Setup stub for our User dependency
		existsStub.yields(null, false);
		createStub.yields(null, 'bdickason');

		eventbus.once('twitch:say', function(response) {
			assert.equal(response.length, 1);	// Response should only be one line
			assert.deepEqual(response[0], _response);
			done();
		});

		eventbus.emit('user:join', _users);
	});
	it('add: Can add multiple users at once', function(done) {
		var _users = ['teamalea', 'hpc_dumbledore'];
		var _response = [];
		_response.push(strings.join.welcome + _users[0] + strings.join.new_here);
		_response.push(strings.join.welcome + _users[1] + strings.join.new_here);

		// Setup stub for our User dependency
		existsStub.yields(null, false);
		createStub.yields(null, 'teamalea');

		var spy = this.sinon.spy();
		eventbus.once('twitch:say', spy);
		eventbus.once('twitch:say', spy);

		eventbus.once('twitch:say', function(response) {
			assert.equal(response.length, 1);	// Response should only be one line
			assert.deepEqual(response[0], _response[0]);

			sinon.assert.calledTwice(spy);

			done();
		});

		eventbus.emit('user:join', _users);
	});
	it('add: Doesn\'t create a new user if one exists', function() {
		var _username = ['bdickason'];

		// Setup stub for our User dependency
		existsStub.yields(null, true);

		var spy = this.sinon.spy();
		eventbus.once('twitch:say', spy);

		eventbus.emit('user:join', _username);
		this.sinon.assert.notCalled(spy);

	});

	afterEach(function() {
	    sandbox.restore();
	});

});
