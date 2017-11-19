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
		Quidditch.start(eventbus, Team, {delay: 5} );
	});
	describe('Quidditch match', function() {
		it('Contains twitch overlay', function() {
			var _name = 'quidditch';
			var _type = 'html';
			var _view = 'views/quidditch.pug';
			var _static = '/static';

			assert.equal(Quidditch.overlay.name, _name);
			assert.equal(Quidditch.overlay.type, _type);
			assert.include(Quidditch.overlay.view, _view);
			assert.include(Quidditch.overlay.static, _static);

		});

		var eventbusSpy;
		before(function() {
			// Spy for overlay event
			eventbusSpy = sinon.spy();
			eventbus.once('overlays:qsw:show', eventbusSpy);

		});
		it('Pays the winner', function(done) {
			var _house = 'Slytherin';
			var _points = 5;

			var data = true;	// Points added successfully

			addStub.yields(null, data);

			// Pay winners
			eventbus.once('twitch:say', function(response) {
				console.log(response);
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
