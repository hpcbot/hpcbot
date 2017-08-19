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

		Housecup = require('.');
		Housecup.start(eventbus, Team);
	});
	describe('!cup', function() {
		it('There are standings: Returns the house standings in order', function(done) {
			var _response = [];
			_response.push('House Cup Standings:');
			_response.push('1) Slytherin: 15');
			_response.push('2) Ravenclaw: 10');
			_response.push('3) Hufflepuff: 7');
			_response.push('4) Gryffindor: 5');

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
				assert.equal(response[0], 'House Cup Standings:');
				assert.equal(response[1], '1) Slytherin: 15');
				assert.equal(response[2], '2) Ravenclaw: 10');
				assert.equal(response[3], '3) Hufflepuff: 7');
				assert.equal(response[4], '4) Gryffindor: 5');

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
	describe('!reset-cup', function() {
		it('No Standings: Resets the cup standings', function(done) {
			var _response = [];
			_response.push('The house cup has been reset. May the odds be forever in your favor');

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
				assert.equal(response[0], 'House Cup Standings:');
				assert.equal(response[1], '1) Slytherin: 15');
				assert.equal(response[2], '2) Ravenclaw: 10');
				assert.equal(response[3], '3) Hufflepuff: 7');
				assert.equal(response[4], '4) Gryffindor: 5');

				done();
			});

			eventbus.emit('cup:reset'); */
		});
		it('Standings: Resets the cup standings', function(done) {
			// eventbus.emit('cup:reset');
		});
	});
	afterEach(function() {
	    sandbox.restore();
	});
});
