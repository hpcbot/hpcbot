/* Test for commends.js */

var assert = require('chai').assert;
var sinon = require('sinon');

var strings = require('../../../config/strings.json');

var EventEmitter = require('events');
var eventbus = new EventEmitter;	// Temporary event bus to prevent events firing across files

var Housecup;

describe('House Cup', function() {
	beforeEach(function() {
	    this.sinon = sandbox = sinon.sandbox.create();

		// Stub out User
		Team = require('../../models/team');
		getAllStub = this.sinon.stub(Team, 'getAll');
		addStub = this.sinon.stub(Team, 'add');
		resetStub = this.sinon.stub(Team, 'reset');

		Housecup = require('.');
		Housecup.start(eventbus, Team);
	});
	describe('!cup', function() {
		it('There are standings: Returns the house standings in order', function(done) {
			var _response = [];
			_response.push('House Cup Standings:');
			_response.push('1. Slytherin: 15');
			_response.push('2. Ravenclaw: 10');
			_response.push('3. Hufflepuff: 7');
			_response.push('4. Gryffindor: 5');

			var data = {
				'Gryffindor': '5',
				'Hufflepuff': '7',
				'Slytherin': '15',
				'Ravenclaw': '10'
			};

			// Setup stub for our User dependency
			getAllStub.yields(null, data);

			eventbus.once('twitch:say', function(response) {
				assert.equal(response.length, 5);	// There should only be one line in the response
				assert.equal(response[0], _response[0]);
				assert.equal(response[1], _response[1]);
				assert.equal(response[2], _response[2]);
				assert.equal(response[3], _response[3]);
				assert.equal(response[4], _response[4]);

				done();
			});

			eventbus.emit('cup:show');
		});
		it('No standings: Says that the house cup hasn\'t started yet', function(done) {
			var _response = [];
			_response.push('It looks like the house cup hasn\'t started yet.');

			var data = {};

			// Setup stub for our User dependency
			getAllStub.yields(null, data);

			eventbus.once('twitch:say', function(response) {
				assert.equal(response.length, 1);	// There should only be one line in the response
				assert.equal(response[0], _response[0]);

				done();
			});

			eventbus.emit('cup:show');
		});
	});
	describe('!add', function() {
		it('Proper input: Adds 5 points to a house', function(done) {
			var input = 's 5';

			var _response = [];
			var _username = 'hpc.dobby';

			var data = true;

			addStub.yields(null, data);

			eventbus.once('twitch:whisper', function(username, response) {
				assert.equal(response.length, 1);
				assert.equal(response[0], 'Added 5 points to Slytherin');
				assert.equal(username, _username);
				done();
			});

			eventbus.emit('cup:add', 'hpc.dobby', input);
		});
		it('Proper input: Adds 10 points to a house', function(done) {
			var input = 'r 10';

			var _response = [];
			var _username = 'hpc.dobby';

			var data = true;

			addStub.yields(null, data);

			eventbus.once('twitch:whisper', function(username, response) {
				assert.equal(response.length, 1);
				assert.equal(response[0], 'Added 10 points to Ravenclaw');
				assert.equal(username, _username);
				done();
			});

			eventbus.emit('cup:add', 'hpc.dobby', input);
		});
		it('Bad input: No Parameters', function(done) {
			var input = null;

			var _response = [];
			var _username = 'hpc.dobby';

			var data = true;

			addStub.yields(null, data);

			eventbus.once('twitch:whisper', function(username, response) {
				assert.equal(response.length, 1);
				assert.equal(response[0], 'Usage: !add h 5');
				assert.equal(username, _username);
				done();
			});

			eventbus.emit('cup:add', 'hpc.dobby', input);
		});
		it('Bad input: No House', function(done) {
			var input = '5';

			var _response = [];
			var _username = 'hpc.dobby';

			var data = true;

			addStub.yields(null, data);

			eventbus.once('twitch:whisper', function(username, response) {
				assert.equal(response.length, 1);
				assert.equal(response[0], 'Please enter the first letter of a house (g/h/r/s).');
				assert.equal(username, _username);
				done();
			});

			eventbus.emit('cup:add', 'hpc.dobby', input);
		});
		it('Bad input: No Number', function(done) {
			var input = 'h';

			var _response = [];
			var _username = 'hpc.dobby';

			var data = true;

			addStub.yields(null, data);

			eventbus.once('twitch:whisper', function(username, response) {
				assert.equal(response.length, 1);
				assert.equal(response[0], 'Usage: !add h 5');
				assert.equal(username, _username);
				done();
			});

			eventbus.emit('cup:add', 'hpc.dobby', input);
		});
		it('Bad input: Number besides 5 or 10', function(done) {
			var input = 'h 3';

			var _response = [];
			var _username = 'hpc.dobby';

			var data = true;

			addStub.yields(null, data);

			eventbus.once('twitch:whisper', function(username, response) {
				assert.equal(response.length, 1);
				assert.equal(response[0], 'You can only award 5 or 10 points at a time.');
				assert.equal(username, _username);
				done();
			});

			eventbus.emit('cup:add', 'hpc.dobby', input);
		});
	});
	describe('!reset-cup', function() {
		it('Resets the cup standings', function(done) {
			var _response = [];
			_response.push('The house cup has been reset. May the odds be forever in your favor');
			var _username = 'hpc.dobby';

			var data = true;

			// Setup stub for our User dependency
			resetStub.yields(null, data);

			eventbus.once('twitch:whisper', function(username, response) {
				assert.equal(response.length, 1);	// There should only be one line in the response
				assert.equal(response[0], _response[0]);
				assert.equal(username, _username);
				done();
			});

			eventbus.emit('cup:reset', 'hpc.dobby');
		});
	});
	afterEach(function() {
	    sandbox.restore();
	});
});
