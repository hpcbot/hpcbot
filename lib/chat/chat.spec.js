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

			eventbus.emit('chat:parse', userstate, message, self);

			assert.equal(count, 0);
		});

		it('Accepts a valid command', function(done) {
			var userstate = {};
			var message = "!sortinghat";
			var self=false;

			var _command = "sortinghat";

			eventbus.once('chat:command', function(username, command, parameters) {
				assert.equal(command, _command);

				done();
			});

			eventbus.emit('chat:parse', userstate, message, self);

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

			eventbus.emit('chat:parse', userstate, message, self);
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

			eventbus.emit('chat:parse', userstate, message, self);
		});
		it('Accepts a whisper from Twitch', function(done) {
			var userstate = {
				username: 'bdickason'
			};
			var message = '!setcommends 53'
			var self = false;

			var _username = 'bdickason';
			var _command = 'setcommends';
			var _parameters = '53'

			eventbus.once('chat:whispercommand', function(username, command, parameters) {
				assert.equal(_username, username);
				assert.equal(_command, command);
				assert.equal(_parameters, parameters);
				done();
			});

			eventbus.emit('chat:parsewhisper', userstate, message, self);
		});
	});
});

describe('Commands', function() {
	describe('!rules', function() {
		it('Calls !rule and passes parameters', function(done) {
			var userstate = {
				username: null
			};
			var message = "!rule 1";
			var self = false;

			var _parameters = "1";

			eventbus.once('rules:get', function(parameters) {
				assert.equal(parameters, _parameters);
				done();
			});
			eventbus.emit('chat:parse', userstate, message, self);
		});
		it('Calls !rules and passes parameters', function(done) {
			var userstate = {
				username: null
			};
			var message = "!rules 1";
			var self = false;

			var _parameters = "1";

			eventbus.once('rules:get', function(parameters) {
				assert.equal(parameters, _parameters);
				done();
			});
			eventbus.emit('chat:parse', userstate, message, self);
		});	
		it('Calls !rules with no parameters', function(done) {
			var userstate = {
				username: null
			};
			var message = "!rules";
			var self = false;

			var _parameters = null;

			eventbus.once('rules:get', function(parameters) {
				assert.equal(parameters, _parameters);
				done();
			});
			eventbus.emit('chat:parse', userstate, message, self);
		});				
	});
});
	describe('output to Twitch', function() {
		describe('!sortinghat', function() {

			it('sorting: Names a sorted user\'s house', function(done) {
				var username = 'bdickason';
				var house = 'Slytherin';
				var err = null;
				
				var _username = 'bdickason';
				var _house = 'Slytherin';
				var _string = strings.sorting.congrats + _username + strings.sorting.joined_house + _house;
				var _line = _string.split(' ');

				eventbus.once('twitch:say', function(response) {
					assert.include(response[0], strings.sorting.congrats);
					assert.include(response[0], _username);
					assert.include(response[0], strings.sorting.joined_house);
					assert.include(response[0], _house);					
					done();
				});

				eventbus.emit('chat:sorted', err, username, house);
			});

			it('sorting: User already sorted', function(done) {
				var username = 'bdickason';
				var house = 'Slytherin';
				var err = 'sorted';
				
				var _string = strings.sorting.user_already_sorted;

				eventbus.once('twitch:say', function(response) {
					var line = response.toString().split(' ');

					assert.include(response.toString(), _string);
					
					done();
				});

				eventbus.emit('chat:sorted', err, username, house);
			});
		});
		describe('!house', function() {
			it('house: User is a muggle', function(done) {
				var err = null;
				var username = 'bdickason';
				var house = 'muggle';

				var _username = 'bdickason';
				var _string = strings.house.muggle;
				
				eventbus.once('twitch:say', function(response) {
					var line = response.toString().split(' ');

					assert.equal(_username, line[0]);
					assert.include(response.toString(), _string);
					done();
				});
				
				eventbus.emit('chat:house', err, username, house);
			});

			it('house: User has a house', function(done) {
			var err = null;
			var username = 'bdickason';
			var house = 'Gryffindor';

			var _username = 'bdickason';
			var _string = strings.house.proud_member_of;
			
				eventbus.once('twitch:say', function(response) {
					var line = response.toString();

					assert.include(line, _username);
					assert.include(line, _string);
					done();
				});
				
			eventbus.emit('chat:house', err, username, house);
			});

			it('house: User not found', function(done) {
			var err = 'User not found';
			var username = 'bdickason';
			var house = null;

			var _username = 'bdickason';
			var _string = strings.house.cannot_find;
		
			eventbus.once('twitch:say', function(response) {
				var line = response.toString();

				assert.include(line, _username);
				assert.include(line, _string);
				done();
			});
				
			eventbus.emit('chat:house', err, username, house);
			});
		});

		describe('Join', function(done) {
			it('join: Greet a new user that joins the channel for the first time', function(done) {
				var err = null;
				var username = 'bdickason';

				var _string = strings.join.welcome + username + strings.join.new_here;

				eventbus.once('twitch:say', function(response) {
					var line = response.toString();

					assert.include(line, _string);
					done();
				});

				eventbus.emit('chat:joined', err, username);
			});
		});
	});



