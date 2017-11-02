/* Test for gold.js */

var assert = require('chai').assert;
var sinon = require('sinon');

var strings = require('../../../config/strings.json');

var EventEmitter = require('events');
var eventbus = new EventEmitter;	// Temporary event bus to prevent events firing across files

var Housecup;

describe('Goblin Gold', function() {
	beforeEach(function() {
	    this.sinon = sandbox = sinon.sandbox.create();

		// Stub out models
		Resource = require('../../models/resource');
		addStub = this.sinon.stub(Resource, 'give');

		Channel = require('../../models/channel');
		userStub = this.sinon.stub(Channel, 'getActiveUsers');

		Gold = require('.');
		Gold.start(eventbus, Resource, Channel);
	});
	describe('!gold', function() {
		it('Proper input: Gives gold to all users currently in chat', function(done) {
			var input = '5';
			var username = 'bdickason';

			var _response = [];
			_amount = 5;

			var addData = true;
			var userData = ['boots_mcscootin', 'teamalea'];

			addStub.yields(null, addData);
			userStub.yields(null, userData);

			eventbus.once('twitch:say', function(response) {
				assert.equal(response.length, 1);
				assert.equal(response[0], strings.gold.gave + 5 + strings.gold.to_channel);
				done();
			});

			eventbus.emit('gold:add', username, input);
		});
		it('Bad input: No Parameters', function(done) {
			var input = null;

			var _response = [];

			var data = true;

			addStub.yields(null, data);

			eventbus.once('twitch:whisper', function(username, response) {
				assert.equal(response.length, 1);
				assert.equal(response[0], strings.gold.error_no_params);
				done();
			});

			eventbus.emit('gold:add', 'bdickason', input);
		});
		it('Bad input: Less than or equal to zero', function(done) {
			var input = -5;

			var _response = [];

			var data = true;

			addStub.yields(null, data);

			eventbus.once('twitch:whisper', function(username, response) {
				assert.equal(response.length, 1);
				assert.equal(response[0], strings.gold.error_greater_than_zero);
				done();
			});

			eventbus.emit('gold:add', 'bdickason', input);
		});
	});
	describe('gold overlay', function() {
		it('Gives one gold when an overlay is triggered', function(done) {
			var input = 1;

			var _response = [];

			var addData = true;
			var userData = ['boots_mcscootin', 'teamalea'];

			addStub.yields(null, addData);
			userStub.yields(null, userData);

			eventbus.once('twitch:say', function(response) {
				assert.equal(response.length, 1);
				assert.equal(response[0], strings.gold.gave + 1 + strings.gold.to_channel);
				done();
			});

			eventbus.emit('gold:overlay');
		});
	});
	afterEach(function() {
	    sandbox.restore();
	});
});
