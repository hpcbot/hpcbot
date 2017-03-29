/* Test for lib/chat.js */

var assert = require('chai').assert;

var eventbus = require('../eventbus');
var strings = require('../../config/strings.json');

var Chat = require('.');
var chat = Chat.start();

describe('Chat parser', function() {	
	describe('input from Twitch', function() {

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
	});

	describe('output to Twitch', function() {
		it('Names a sorted user\'s house', function(done) {
			var username = 'bdickason';
			var house = 'Slytherin';
			var err = null;
			
			var _username = 'bdickason';
			var _house = 'Slytherin';
			var _string = strings.house.proud_member_of;

			eventbus.once('twitch:say', function(response) {
				console.log(response);
				var line = response.toString().split(' ');
				assert.equal(_username, line[0]);
				assert.include(response.toString(), _string);
				assert.equal(_house, line[7]);
				done();
			});

			eventbus.emit('chat:sorted', err, username, house);

		})

	});
});



