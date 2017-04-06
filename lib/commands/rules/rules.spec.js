/* Test for rules.js */

var assert = require('chai').assert;
var sinon = require('sinon');

var eventbus = require('../../eventbus');
var strings = require('../../../config/strings.json');

var Rules = require('.');
var rules = Rules.start();


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

			eventbus.emit('rules:get', parameters);
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

			eventbus.emit('rules:get', parameters);
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

			eventbus.emit('rules:get', parameters);
		});
		it('Number parameter above 3: Displays random rule b/t 4-7', function() {
			var parameters = '5';

			var _response = strings.rules.rule;	
			_response = _response.slice(4); // Skip rules 1-3 when choosing random rules

			eventbus.once('twitch:say', function(response) {
				assert.include(_response, response.toString());
			});

			eventbus.emit('rules:get', parameters);
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

			eventbus.emit('rules:get', parameters);
		});
		it('Non-Number parameter: Doesn\'t display anything', function() {
			var user = 'bdickason';
			var command = 'rule';
			var parameters = 'abc';

			var _response = [];
			_response.push(strings.rules.rule[5]);

			var spy = sinon.spy();

			eventbus.once('twitch:say', spy);

			eventbus.emit('rules:get', parameters);
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
			
			eventbus.emit('rules:get', parameters);
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

			eventbus.emit('rules:get', parameters);
		});
	});