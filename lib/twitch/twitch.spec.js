// /* Test for lib/chat.js */

var assert = require('chai').assert;
var sinon = require('sinon');

var EventEmitter = require('events');
var eventbus = new EventEmitter;	// Temporary event bus to prevent events firing across files
var tmiClient = new EventEmitter;	// Temporary tmi client to throw fake events

require('dotenv').config();	// Load environment variables from .env

var Twitch = require('.');
twitch = Twitch.start(eventbus, tmiClient, '#bdickason');

describe('Twitch client', function() {
	beforeEach(function() {
	    this.sinon = sandbox = sinon.sandbox.create();
	});
	describe('Receiving from Twitch', function() {
		it('Chat: Sends out an event', function() {		
			var channel = '#harrypotterclan';
			var userstate = {
				username: 'bdickason'
			};
			var message = 'testing';
			var self = false;
	
			var spy = sinon.spy();

			eventbus.once('chat:parse', spy);

			tmiClient.emit('chat', channel, userstate, message, self);

			sinon.assert.calledOnce(spy);
			sinon.assert.calledWith(spy, userstate, message, self);
	 	});
	 	it('Whisper: Sends out an event', function() {		
			var from = 'bdickason';
			var userstate = {
				username: 'bdickason'
			};
			var message = 'testing';
			var self = false;
	
			var spy = sinon.spy();

			eventbus.once('chat:parsewhisper', spy);

			tmiClient.emit('whisper', from, userstate, message, self);

			sinon.assert.calledOnce(spy);
			sinon.assert.calledWith(spy, userstate, message, self);
	 	});
	 	it('Join: Sends out an event', function() {		
			var channel = '#harrypotterclan';
			var userstate = {
				username: 'bdickason'
			};
			var self = false;
	
			var spy = sinon.spy();

			eventbus.once('user:join', spy);

			tmiClient.emit('join', channel, userstate, self);

			sinon.assert.calledOnce(spy);
			sinon.assert.calledWith(spy, userstate);
	 	});
	});
	describe('Broadcasting to Twitch', function() {
		it('Say: Listens for an event', function() {
			var channel = '#bdickason';
			var response = ['Welcome to the Harry Potter Clan!'];

			var _response = 'Welcome to the Harry Potter Clan!';

			var sayStub = tmiClient.say = sinon.stub();

			eventbus.emit('twitch:say', response);

			sinon.assert.calledOnce(sayStub);
			sinon.assert.calledWith(sayStub, channel, _response);
	 	});
		it('Say: Listens for a multi-line event', function() {
			var channel = '#bdickason';
			var response = ['Welcome to the Harry Potter Clan!', 'We are glad to have you!'];

			var _response = 'We are glad to have you!';

			var sayStub = tmiClient.say = sinon.stub();

			eventbus.emit('twitch:say', response);

			sinon.assert.calledTwice(sayStub);
			sinon.assert.calledWith(sayStub, channel, _response);
	 	});
		it('Whisper: Listens for an event', function() {
			var username = 'teamalea';
			var response = ['OMG so many commends!'];

			var _response = 'OMG so many commends!';

			var whisperStub = tmiClient.whisper = sinon.stub();

			eventbus.emit('twitch:whisper', username, response);

			sinon.assert.calledOnce(whisperStub);
			sinon.assert.calledWith(whisperStub, username, _response);
	 	});
		it('Whisper: Listens for a multi-line event', function() {
			var username = 'teamalea';
			var response = ['OMG so many commends!', 'Are you cheating?'];

			var _response = 'Are you cheating?';

			var whisperStub = tmiClient.whisper = sinon.stub();

			eventbus.emit('twitch:whisper', username, response);

			sinon.assert.calledTwice(whisperStub);
			sinon.assert.calledWith(whisperStub, username, _response);
	 	});
	});
	afterEach(function() {
	    sandbox.restore();
	});
})
