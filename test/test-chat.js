/* Test for lib/chat.js */

var assert = require('assert');

var chat = require('../lib/chat.js');
var strings = require('../config/strings.json');

describe('Chat parser', function() {
	it('Ignores an empty command', function() {
		var userstate = {};
		var message = "";
		var self=false;

		chat.command(userstate, message, self, function(response) {
			assert.equal(response, null);
		});
	});

	it('Ignores case on a command', function() {
		var userstate = {
			username: "bdickason"
		};
		var message = "!SoRTiNGhaT";
		var self = false;

		var _house = "muggle";
		var _response = userstate.username + strings.general.is_a + _house;	// Expected Response

		chat.command(userstate, message, self, function(response) {
			assert.equal(response, _response);
		});
	})

	describe('!sortinghat', function() {
		it('Accepts the command by itself', function() {
			var userstate = {
				username: "bdickason"
			};
			var message ="!sortinghat";
			var self=false;

			var _house = "muggle";
			var _response = userstate.username + strings.general.is_a + _house + strings.general.exclamation;	// Expected Response

			chat.command(userstate, message, self, function(response) {
				assert.equal(response, _response);
			});
		});

		it('Ignores additional text on the command', function() {
			var userstate = {
				username: "bdickason"
			};
			var message ="!sortinghat test crap!";
			var self=false;

			var _house = "muggle";
			var _response = userstate.username + strings.general.is_a + _house + strings.general.exclamation;	// Expected Response

			chat.command(userstate, message, self, function(response) {
				assert.equal(response, _response);
			});
		});
	});

	describe('!rules', function() {
		it('No parameters: Accepts !rule', function() {
			var message="!rule";
			var userstate = null;
			var self = null;

			var _response = [];
			_response.push(strings.rules.overview);
			_response.push(strings.rules.rule[1]);
			_response.push(strings.rules.rule[2]);
			_response.push(strings.rules.rule[3]);

			chat.command(userstate, message, self, function(response) {
				assert.deepEqual(response, _response);
			});
		});
		it('No parameters: Shows rules 1-3', function() {
			var message="!rules";
			var userstate = null;
			var self = null;

			var _response = [];
			_response.push(strings.rules.overview);
			_response.push(strings.rules.rule[1]);
			_response.push(strings.rules.rule[2]);
			_response.push(strings.rules.rule[3]);

			chat.command(userstate, message, self, function(response) {
				assert.deepEqual(response, _response);
			});
		});

		it('Rule parameter: Shows specific rule if first number is entered', function() {
			var message="!rule 0";
			var userstate = "bdickason";
			var self=false;

			var _response = strings.rules.rule[0];
			console.log(_response);

			chat.command(userstate, message, self, function(response) {
				assert.equal(response, _response);
			});

		});

		it('Rule parameter: Shows specific rule if last number is entered', function() {
			var message="!rule 5";
			var userstate = null;
			var self = null;

			var _response= strings.rules.rule[5];

			chat.command(userstate, message, self, function(response) {
				assert.equal(response, _response);
			});

		});

		it('Rule parameter: Shows specific rule if number and pound sign is entered', function() {
			var message="!rule #5";
			var userstate = null;
			var self = null;

			var _response= strings.rules.rule[5];

			chat.command(userstate, message, self, function(response) {
				assert.equal(response, _response);
			});
		});

		it('Rule parameter: Doesn\'t show anything if number > rule number is entered', function() {
			var message="!rule 100";
			var userstate = null;
			var self = null;

			var _response= null;

			chat.command(userstate, message, self, function(response) {
				assert.equal(response, _response);
			});
		});

		it('Rule parameter: Doesn\'t show anything if text is entered', function() {
			var message="!rule test";
			var userstate = null;
			var self = null;

			var _response= null;

			chat.command(userstate, message, self, function(response) {
				assert.equal(response, _response);
			});
		});
	});

});

