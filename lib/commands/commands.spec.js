/* Test for lib/chat.js */

var assert = require('chai').assert;
var sinon = require('sinon');

var strings = require('../../config/strings.json');

var EventEmitter = require('events');
var eventbus = new EventEmitter;	// Temporary event bus to prevent events firing across files

var Commands = require('.');
var commands = Commands.start(eventbus);

describe('Commands', function() {	

	describe('!sortinghat', function() {	
		it('Only passes username', function() {
			var user = 'bdickason';
			var command = 'sortinghat';
			var parameters = 'test';
			var _username = 'bdickason';

			eventbus.once('user:sort', function(username, test) {
				assert.equal(username, _username);
				assert.equal(test, null);
				console.log('made it here');
			});

			eventbus.emit('chat:command', user, command, parameters);
		});
	});


	describe('!setcommends', function() {	
		it('No Parameters: Ignores input', function() {
			var user = 'bdickason';
			var command = 'setcommends';
			var parameters = '';
			
			var _err = 'No parameters passed in';

			eventbus.once('error:issue', function(err) {
				assert.equal(_err, err);
			});

			eventbus.emit('chat:whispercommand', user, command, parameters);
		});
		it('Parameters: Accepts numeric input', function() {
			var user = 'bdickason';
			var command = 'setcommends';
			var parameters = '35';
			
			var _username = 'bdickason';
			var _commends = '35';

			eventbus.once('user:setcommends', function(username, commends) {
				assert.equal(_username, username);
				assert.equal(_commends, commends);
			});

			eventbus.emit('chat:whispercommand', user, command, parameters);
		});
	});
	describe('!getcommends', function() {	
		it('No Parameters: Returns your commends', function() {
			var user = 'bdickason';
			var command = 'getcommends';
			var parameters = '';
			
			var _err = 'No parameters passed in';

			eventbus.once('user:getcommends', function(username) {
				assert.equal(_username, username);
			});

			eventbus.emit('chat:command', user, command, parameters);
		});
		it('Parameters: Returns a specific user\'s commends', function() {
			var user = 'bdickason';
			var command = 'getcommends teamalea';
			var parameters = '35';
			
			var _username = 'teamalea';
			var _commends = '35';

			eventbus.once('user:getcommends', function(username) {
				assert.equal(_username, username);
				assert.equal(_commends, commends);
			});

			eventbus.emit('chat:command', user, command, parameters);
		});
	});
});
