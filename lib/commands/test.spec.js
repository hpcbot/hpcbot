/* Test for lib/chat.js */

var assert = require('chai').assert;
// var sinon = require('sinon');

var eventbus = require('../eventbus');
var strings = require('../../config/strings.json');

var Commands = require('.');
var commands = Commands.start();


	describe('test', function() {

	
		it('Number at end of array: Says random rule', function() {
			var user = 'bdickason';
			var command = 'rule';
			var parameters = '6';

			var _response = strings.rules.rule;	
			_response = _response.slice(4); // Skip rules 1-3 when choosing random rules

			eventbus.once('twitch:say', function(response) {
				assert.include(_response, response.toString());
			});

			eventbus.emit('chat:command', user, command, parameters);
		});
	});