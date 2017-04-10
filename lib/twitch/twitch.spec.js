// /* Test for lib/chat.js */

// var assert = require('chai').assert;
// var sinon = require('sinon');

// var EventEmitter = require('events');
// var eventbus = new EventEmitter;	// Temporary event bus to prevent events firing across files



// // Setup fake tmi object for testing Twitch client functionality
// const EventEmitter = require('events');
// var clientStub = new EventEmitter();
// clientStub.say = sinon.stub();
// clientStub.say.resolves('test');	// Because we then/catch say

// var channel = '#bdickason';

// var Twitch = require('.');
// var twitch = Twitch.start(eventbus, clientStub, channel);

// describe('Twitch client', function() {
// 	describe('Chat', function() {
// 		it('Sends out an event when someone says something', function() {		
// 			var userstate = {
// 				username: 'bdickason'
// 			};
// 			var message = 'testing';
// 			var self = false;

// 			var spy = sinon.spy();

// 			eventbus.once('chat:parse', spy);

// 			clientStub.emit('chat', userstate, message, self);

// 			sinon.assert.calledOnce(spy);
// 	 	});
// 	});
// })
// // 	it('Join - Passes proper variables to user', function(done) {
// // 	});
// // 	it('Say - Receives proper variables', function(done) {

// // 	});

// // });
