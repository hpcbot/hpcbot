/* Test for lib/chat.js */

var assert = require('assert');

var eventbus = require('../eventbus');

var Chat = require('.');
var chat = Chat.start();

describe('Chat parser', function() {	
	beforeEach(function() {
		// Ensure we don't fire multiple events per session
		
	});

	it('Ignores an empty command', function() {
		var channel = "#harrypotterclan";
		var userstate = {};
		var message = "sortinghat";
		var self=false;

		var count = 0;	// How many times was the event called?

		eventbus.once('chat:command', function() {
			count++;
		});

		eventbus.emit('twitch:chat', channel, userstate, message, self);

		assert.equal(count, 0);
	});

	it('Accepts a valid command', function(done) {
		var channel = "#harrypotterclan";
		var userstate = {};
		var message = "!sortinghat";
		var self=false;

		var _command = "sortinghat";

		eventbus.once('chat:command', function(username, command, parameters) {
			assert.equal(command, _command);

			done();
		});

		eventbus.emit('twitch:chat', channel, userstate, message, self);

	});

	it('Ignores case on a command', function(done) {
		var channel = "#harrypotterclan";
		var userstate = {};
		var message = "!sortinghat";
		var self=false;

		var _command = "sortinghat";
		eventbus.once('chat:command', function(username, command, parameters) {
			assert.equal(_command, command);
			done();
		});

		eventbus.emit('twitch:chat', channel, userstate, message, self);
	});

	it('Accepts parameters after the command', function(done) {
		var channel = "#harrypotterclan";
		var userstate = {};
		var message = "!sortinghat omg it works";
		var self=false;

		var _command = "sortinghat";
		var _parameters = "omg it works";
		eventbus.once('chat:command', function(username, command, parameters) {
			assert.equal(_command, command);
			assert.equal(_parameters, parameters);
			done();
		});

		eventbus.emit('twitch:chat', channel, userstate, message, self);
	});

/*
	describe('!sortinghat', function() {
		var channel = "#harrypotterclan";
		var userstate = {};
		var message = "!TesT";
		var self=false;

		var count = 0;	// How many times was the event called?
		var _command = "test";

		eventbus.on('chat:command', function(username, command, parameters) {
			count++;
			assert.equal(command, _command);
			done();
		});

		eventbus.emit('twitch:chat', channel, userstate, message, self);
		assert.equal(count, 1)
		});

		it('Ignores additional text on the command', function(done) {
			var userstate = {
				username: "bdickason"
			};
			var message ="!sortinghat test crap!";
			var self=false;

			var _response = [];
			_response.push(strings.congratulations + userstate.username + strings.general.exclamation + strings.sorting.joined);	// Expected Response

			Users.add('bdickason', function(err, username) {
				chat.command(userstate, message, self, function(response) {
					// Because we have an annoying dependency on Users for now, check that the string starts the same
					response[0] = response[0].substr(0, _response[0].length);
					assert.deepEqual(response, _response);
					done();
				});
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

	describe('!house', function(done) {
		it('No parameters: Accepts !house', function() {
			var message="!house";
			var userstate = {
				username: "bdickason"
			};
			var self = null;

			var _response = [];
			_response.push(userstate.username + strings.house.proud_member_of);

			Users.add('bdickason', function(err, username) {
				Users.sorting(userstate, function(err, house) {
					chat.command(userstate, message, self, function(response) {
						// Because we have an annoying dependency on Users for now, check that the string starts the same
						response[0] = response[0].substr(0, _response[0].length);
						assert.deepEqual(response, _response);
						done();
					});
				});
			});
		});

		it('Single user parameter: Accepts !house <name>', function(done) {	
			var message="!house bdickason";
			var userstate = {
				username: "dumbledore"
			};
			var userstate_to_sort = {
				username: "bdickason"
			}
			var self = null;

			var _response = [];
			_response.push(userstate_to_sort.username + strings.house.proud_member_of);

			Users.add('bdickason', function(err, username) {
				Users.sorting(userstate_to_sort, function(err, house) {
					chat.command(userstate, message, self, function(response) {
						console.log("userstate: " + userstate);
						console.log("house: " + house);
						console.log("response: " + response);
						// Because we have an annoying dependency on Users for now, check that the string starts the same
						response[0] = response[0].substr(0, _response[0].length);
						assert.deepEqual(response, _response);
						done();
					});
				});
			});
		});
	});
*/
});

