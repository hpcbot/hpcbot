/* Test for lib/chat.js */

var assert = require('chai').assert;
var sinon = require('sinon');

var strings = require('../../config/strings.json');

var EventEmitter = require('events');
var eventbus = new EventEmitter;	// Temporary event bus to prevent events firing across files

// Pass in dummy token for testing
var Mixpanel = require('mixpanel');
var mixpanel = Mixpanel.init('test');

var Chat = require('.');
var chat = Chat.start(eventbus, mixpanel);

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
		it('Whisper: Accepts a whitelisted whisper from Twitch', function(done) {
			var userstate = {
				username: 'bdickason'
			};
			var message = '!setcommends 53'
			var self = false;

			var _username = 'bdickason';
			var _parameters = '53'

			eventbus.once('commends:set', function(username, parameters) {
				assert.equal(_username, username);
				assert.equal(_parameters, parameters);
				done();
			});

			eventbus.emit('chat:parsewhisper', userstate, message, self);
		});
		it('Whisper: Rejects a non-whitelisted whisper from Twitch', function(done) {
			var userstate = {
				username: 'randomUser'
			};
			var message = '!setcommends 53'
			var self = false;

			var _username = 'randomUser';
			var _parameters = '53'

			var spy = sinon.spy();
			eventbus.once('commends:set', spy);

			eventbus.emit('chat:parsewhisper', userstate, message, self);
			sinon.assert.notCalled(spy);

			done();
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
		describe('!hpcwins', function() {
			it('Starts a hpc wins overlay', function(done) {
				var userstate = {
					username: 'bdickason'
				};
				var message = "!hpcwins";
				var self=false;

				var _username = 'bdickason';

				eventbus.once('hpcwins:start', function(username) {
					assert.equal(username, _username);
					done();
				});

				eventbus.emit('chat:parsewhisper', userstate, message, self);
			});
		});
		describe('!powermove', function() {
			it('Starts a powermove overlay', function(done) {
				var userstate = {
					username: 'bdickason'
				};
				var message = "!powermove";
				var self=false;

				var _username = 'bdickason';

				var spy = sinon.spy();

				eventbus.once('powermove:start', spy);

				eventbus.emit('chat:parsewhisper', userstate, message, self);

				sinon.assert.calledOnce(spy);
				done();
			});

		});
		describe('!sortinghat', function() {
			it('Passes username as a parameter', function(done) {
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
		});
		describe('!sortingtest', function() {
			it('Starts a sortinghat overlay', function(done) {
				var userstate = {
					username: 'bdickason'
				};
				var message = "!sortingtest";
				var self=false;

				var _username = 'bdickason';

				eventbus.once('house:test', function(username) {
					assert.equal(username, _username);
					done();
				});

				eventbus.emit('chat:parsewhisper', userstate, message, self);
			});
		});
		describe('!getcommends', function() {
			it('Accepts a parameter', function(done) {
				var userstate = {
					username: 'bdickason'
				};
				var message = "!commends teamalea";
				var self=false;

				var _username = 'bdickason';
				var _parameters = 'teamalea';

				eventbus.once('commends:get', function(username, parameters) {
					assert.equal(username, _username);
					assert.equal(parameters, _parameters);
					done();
				});

				eventbus.emit('chat:parse', userstate, message, self);
			});
		});
		describe('!setcommends', function() {
			it('Accepts a parameter', function(done) {
				var userstate = {
					username: 'bdickason'
				};
				var message = "!setcommends 1234";
				var self=false;

				var _username = 'bdickason';
				var _parameters = 1234;

				eventbus.once('commends:set', function(username, parameters) {
					assert.equal(username, _username);
					assert.equal(parameters, _parameters);
					done();
				});

				eventbus.emit('chat:parsewhisper', userstate, message, self);
			});
		});
		describe('!status', function() {
			it('Accepts a parameter', function(done) {
				var userstate = {
					username: 'bdickason'
				};
				var message = "!status teamalea";
				var self=false;

				var _username = 'bdickason';
				var _parameters = 'teamalea';

				eventbus.once('status:get', function(username, parameters) {
					assert.equal(username, _username);
					assert.equal(parameters, _parameters);
					done();
				});

				eventbus.emit('chat:parse', userstate, message, self);
			});
		});
		describe('!text', function() {
			it('Starts a text overlay', function(done) {
				var userstate = {
					username: 'bdickason'
				};
				var message = "!text testing 123";
				var self=false;

				var _username = 'bdickason';
				var _text = 'testing 123';

				eventbus.once('text:show', function(username, text) {
					assert.equal(username, _username);
					assert.equal(text, _text);
					done();
				});

				eventbus.emit('chat:parsewhisper', userstate, message, self);
			});
		});
		describe('!2rnb', function() {
			it('Starts a tworaxandbax overlay', function(done) {
				var userstate = {
					username: 'bdickason'
				};
				var message = "!2rnb";
				var self=false;

				var _username = 'bdickason';

				eventbus.once('tworax:start', function(username) {
					assert.equal(username, _username);
					done();
				});

				eventbus.emit('chat:parsewhisper', userstate, message, self);
			});
		});
	});
	describe('Utility Functions', function() {
		describe('isMod', function() {
			it('Returns true if user is whitelisted', function() {
				var username = 'bdickason';

				var _mod = true;

				var mod = Chat.isMod(username);
				assert.equal(mod, _mod);
			});
			it('Returns false if user is not whitelisted', function() {
				var username = 'randoMcRanderson';

				var _mod = false;

				var mod = Chat.isMod(username);
				assert.equal(mod, _mod);
			});
		});
	});
});
