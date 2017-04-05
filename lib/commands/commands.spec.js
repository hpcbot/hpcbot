/* Test for lib/chat.js */

var assert = require('chai').assert;
var sinon = require('sinon');

var eventbus = require('../eventbus');
var strings = require('../../config/strings.json');

var Commands = require('.');
var commands = Commands.start();

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

	describe('!rules', function() {	
		it('No Parameters: Displays 3 rules', function() {
			var user = 'bdickason';
			var command = 'rule';
			var parameters = null;

			var _response = [];
			_response.push(strings.rules.overview);
			_response.push(strings.rules.rule[1]);
			_response.push(strings.rules.rule[2]);
			_response.push(strings.rules.rule[3]);

			eventbus.once('twitch:say', function(response) {
				assert.deepEqual(response, _response);
			});

			eventbus.emit('chat:command', user, command, parameters);
		});
		it('Accepts rule or rules', function() {
			var user = 'bdickason';
			var command = 'rules';
			var parameters = null;

			var _response = [];
			_response.push(strings.rules.overview);
			_response.push(strings.rules.rule[1]);
			_response.push(strings.rules.rule[2]);
			_response.push(strings.rules.rule[3]);

			eventbus.once('twitch:say', function(response) {
				assert.deepEqual(response, _response);
			});

			eventbus.emit('chat:command', user, command, parameters);
		}); 
		it('Number parameter 1-3: Displays that rule', function() {
			var user = 'bdickason';
			var command = 'rule';
			var parameters = '2';

			var _response = [];
			_response.push(strings.rules.rule[2]);

			eventbus.once('twitch:say', function(response) {
				assert.deepEqual(response, _response);
			});

			eventbus.emit('chat:command', user, command, parameters);
		});
		it('Number parameter above 3: Displays random rule b/t 4-7', function() {
			var user = 'bdickason';
			var command = 'rule';
			var parameters = '5';

			var _response = strings.rules.rule;	
			_response = _response.slice(4); // Skip rules 1-3 when choosing random rules

			eventbus.once('twitch:say', function(response) {
				assert.include(_response, response.toString());
			});

			eventbus.emit('chat:command', user, command, parameters);
		});
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
		it('Non-Number parameter: Doesn\'t display anything', function() {
			var user = 'bdickason';
			var command = 'rule';
			var parameters = 'abc';

			var _response = [];
			_response.push(strings.rules.rule[5]);

			var spy = sinon.spy();

			eventbus.once('twitch:say', spy);

			eventbus.emit('chat:command', user, command, parameters);
			sinon.assert.notCalled(spy);
		});
		it('Doesn\'t show anything if text is entered', function() {
			var user = 'bdickason';
			var command = 'rule';
			var parameters = 'abc';

			var _response = [];
			_response.push(strings.rules.rule[5]);

			var spy = sinon.spy();

			eventbus.once('twitch:say', spy);
			
			eventbus.emit('chat:command', user, command, parameters);
			sinon.assert.notCalled(spy);
		});
		it('Shows specific rule if number and pound sign is entered', function() {
			var user = 'bdickason';
			var command = 'rule';
			var parameters = '#2';

			var _response = [];
			_response.push(strings.rules.rule[2]);

			eventbus.once('twitch:say', function(response) {
				assert.deepEqual(response, _response);
			});

			eventbus.emit('chat:command', user, command, parameters);
		});
	});

	describe('House', function() {	
		it('No Parameters: Passes in the user\'s name', function() {
			var user = 'bdickason';
			var command = 'house';
			var parameters = '';
			
			var _username = 'bdickason';

			eventbus.once('user:house', function(username) {
				assert.equal(username, _username);
			});

			eventbus.emit('chat:command', user, command, parameters);
		});
		it('One Parameters: Passes in the specified user\'s name', function() {
			var user = 'bdickason';
			var command = 'house';
			var parameters = 'teamalea';
			
			var _username = 'teamalea';

			eventbus.once('user:house', function(username) {
				assert.equal(username, _username);
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
});
