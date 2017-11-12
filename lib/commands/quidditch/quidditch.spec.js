/* Test for quiddich.js */

var assert = require('chai').assert;
var sinon = require('sinon');

var strings = require('../../../config/strings.json');

var EventEmitter = require('events');
var eventbus = new EventEmitter;	// Temporary event bus to prevent events firing across files

var Quidditch;
var Team;

describe('Quidditch', function() {
	beforeEach(function() {
		this.sinon = sandbox = sinon.sandbox.create();

		Team = require('../../models/team');

		// Stub out Team
		addStub = this.sinon.stub(Team, 'add');

		Quidditch = require('.');
		Quidditch.start(eventbus, Team);
	});
	describe('Quidditch match', function() {
		it('Triggers twitch overlay', function(done) {
			var username = 'bdickason';

			var _payload = {
				event: 'quidditch'
			};

			eventbus.once('stream:quidditch', function(payload) {
				assert.deepEqual(_payload, payload);
				done();
			});

			eventbus.emit('quidditch:start');
		});

		var eventbusSpy;
		before(function() {
			// Spy for overlay event
			eventbusSpy = sinon.spy();
			eventbus.once('qsw:show', eventbusSpy);

		});
		it('Pays the winner', function(done) {
			var _house = 'Slytherin';
			var _points = 5;

			var data = true;	// Points added successfully

			addStub.yields(null, data);

			// Pay winners
			eventbus.once('twitch:say', function(response) {
				assert.equal(response.length, 1);
				assert.equal(response[0], 'Added ' + _points + ' points to Slytherin');
				assert.equal(eventbusSpy.callCount, 1);
				done();
			});

			// Play overlay
			eventbus.emit('quidditch:winner', _house);
		});
		afterEach(function() {
			sandbox.restore();
		});
  });
});
