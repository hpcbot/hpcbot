/* Test for quiddich.js */

var assert = require('chai').assert;
var sinon = require('sinon');

var strings = require('../../../config/strings.json');

var EventEmitter = require('events');
var eventbus = new EventEmitter;	// Temporary event bus to prevent events firing across files

var Quiddich;

describe('Quiddich', function() {
	beforeEach(function() {
		Quiddich = require('.');
		Quiddich.start(eventbus);
	});
	describe('Quiddich match', function() {
		it('Triggers twitch overlay', function(done)
			var _payload = {
				username: 'bdickason',
				house_text: 'Gryffindor',
				house_image: 'house/images/gryffindor.png',
				house_audio: 'house/audio/gryffindor.m4a'
			}
			var _house = 'Gryffindor';

			eventbus.once('stream:quiddich', function(payload) {
				assert.deepEqual(_payload, payload);
				done();
			});

			eventbus.emit('quiddich:start', username);
		});
  });
});
