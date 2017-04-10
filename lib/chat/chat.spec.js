/* Test for lib/chat.js */

var assert = require('chai').assert;
var sinon = require('sinon');

var strings = require('../../config/strings.json');

var EventEmitter = require('events');
var eventbus = new EventEmitter;	// Temporary event bus to prevent events firing across files

var Chat = require('.');
var chat = Chat.start(eventbus);

describe('Chat parser', function() {
	describe('input from Twitch', function() {
		it('Ignores an empty command', function() {
			var channel = "#harrypotterclan";
			var userstate = {};
			var message = "sortinghat";
			var self=false;

			var count = 0;	// How many times was the event called?

			var spy = sinon.spy();

			eventbus.once('chat:command', spy);

			eventbus.emit('chat:parse', userstate, message, self);
			sinon.assert.notCalled(spy);
		});
		it('Processes a proper command', function(done) {
			var userstate = {
				username: 'bdickason'
			};
			var message = "!sortinghat";
			var self=false;

			var _username = "bdickason";

			eventbus.once('house:set', function(username) {
				assert.equal(username, _username);
				done();
			});

			eventbus.emit('chat:parse', userstate, message, self);
		});

		it('Ignores case on a command', function(done) {
			var userstate = { 
				username: 'bdickason'
			};
			var message = "!SorTingHat";
			var self=false;

			var _username = 'bdickason';
			eventbus.once('house:set', function(username) {
				assert.equal(username, _username);
				done();
			});

			eventbus.emit('chat:parse', userstate, message, self);
		});

		it('Accepts parameters after the command', function(done) {
			var userstate = {
				username: 'bdickason'
			};
			var message = "!house teamalea";
			var self=false;

			var _username = 'bdickason';
			var _parameters = 'teamalea'
			eventbus.once('house:get', function(username, parameters) {
				assert.equal(username, _username);
				assert.equal(parameters, _parameters);
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
		describe('!house', function() {
			it('Calls !house and passes username and parameters', function(done) {
				var userstate = {
					username: 'bdickason'
				};
				var message = "!house teamalea";
				var self = false;

				var _username = 'bdickason'
				var _parameters = "teamalea";

				eventbus.once('house:get', function(username, parameters) {
					assert.equal(userstate.username, _username);
					assert.equal(parameters, _parameters);
					done();
				});
				eventbus.emit('chat:parse', userstate, message, self);
			});
			it('Accepts empty parameter', function(done) {
				var userstate = {
					username: 'bdickason'
				};
				var message = "!house";
				var self = false;

				var _username = 'bdickason'
				var _parameters = null;

				eventbus.once('house:get', function(username, parameters) {
					assert.equal(userstate.username, _username);
					assert.equal(parameters, _parameters);
					done();
				});
				eventbus.emit('chat:parse', userstate, message, self);
			});
		});
		describe('!sortinghat', function() {

			it('sorting: Passes username as a parameter', function(done) {
				var userstate = {
					username: 'bdickason'
				};
				var message = "!sortinghat";
				var self=false;
				
				var _username = 'bdickason';

				eventbus.once('house:set', function(username) {
					assert.equal(username, _username);
					done();
				});

				eventbus.emit('chat:parse', userstate, message, self);
			});

			// it('sorting: User already sorted', function(done) {
			// 	var username = 'bdickason';
			// 	var house = 'Slytherin';
			// 	var err = 'sorted';
				
			// 	var _string = strings.sorting.user_already_sorted;

			// 	eventbus.once('twitch:say', function(response) {
			// 		var line = response.toString().split(' ');

			// 		assert.include(response.toString(), _string);
					
			// 		done();
			// 	});

			// 	eventbus.emit('chat:sorted', err, username, house);
			// });
		});
	});
	
	describe('output to Twitch', function() {
		
			

		describe('Join', function(done) {
			// it('join: Greet a new user that joins the channel for the first time', function(done) {
			// 	var err = null;
			// 	var username = 'bdickason';

			// 	var _string = strings.join.welcome + username + strings.join.new_here;

			// 	eventbus.once('twitch:say', function(response) {
			// 		var line = response.toString();

			// 		// console.log(line);
			// 		// console.log(_string);
			// 		assert.include(line, _string);
			// 		done();
			// 	});

			// 	eventbus.emit('chat:joined', err, username);
			// });
		});
	});
});
