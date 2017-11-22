/* Test for random.js */

var assert = require('chai').assert;
var sinon = require('sinon');

var strings = require('../../../config/strings.json');

var EventEmitter = require('events');
var eventbus = new EventEmitter;	// Temporary event bus to prevent events firing across files

var Random = require('.');
Random.start(eventbus);

describe('Random', function() {
	describe('Dice', function() {
		it('Contains settings for !dice trigger', function() {
			assert.notEqual(Random.triggers, null);
			assert.equal(Random.triggers[1].name, 'dice');
			assert.equal(Random.triggers[1].type, 'chat');
			assert.equal(Random.triggers[1].whitelist, null);
			assert.equal(Random.triggers[1].event, 'random:dice');
		});
		it('No Parameters: Returns a result between 1-6', function(done) {
			var user = 'bdickason';
			var parameters = null;

			var _size = 6;
			var _response = [];
			_response.push(strings.dice.rolling + 6 + strings.dice.sides);
			_response.push(strings.dice.result);

			eventbus.once('twitch:say', function(response) {
				assert.deepEqual(response[0], _response[0]);
				assert.include(response[1], _response[1]);

				// Pull out the number (at the end of the string)
				var line = response[1].split(' ');
				var result = parseInt(line[line.length-1]);
				assert.isAtLeast(result, 1);
				assert.isAtMost(result, 6);
				done();
			});

			eventbus.emit('random:dice', user, parameters);
		});
		it('Non-Number Parameter: Returns an error', function(done) {
			var user = 'bdickason';
			var parameters = 'words';

			var _size = 6;
			var _response = [];
			_response.push(strings.dice.error + 'words');

			eventbus.once('twitch:say', function(response) {
				assert.deepEqual(response[0], _response[0]);

				done();
			});

			eventbus.emit('random:dice', user, parameters);
		});
		it('Negative Number Parameter: Returns an error', function(done) {
			var user = 'bdickason';
			var parameters = -1;

			var _size = 6;
			var _response = [];
			_response.push(strings.dice.error + '-1');

			eventbus.once('twitch:say', function(response) {
				assert.deepEqual(response[0], _response[0]);

				done();
			});

			eventbus.emit('random:dice', user, parameters);
		});
		it('Zero: Returns an error', function(done) {
			var user = 'bdickason';
			var parameters = '0';

			var _size = 6;
			var _response = [];
			_response.push(strings.dice.error + '0');

			eventbus.once('twitch:say', function(response) {
				assert.deepEqual(response[0], _response[0]);

				done();
			});

			eventbus.emit('random:dice', user, parameters);
		});
		it('Positive Number Parameter: Returns a number between 1 and n', function(done) {
			var user = 'bdickason';
			var parameters = 3;

			var _size = 3;
			var _response = [];
			_response.push(strings.dice.rolling + 3 + strings.dice.sides);
			_response.push(strings.dice.result);

			eventbus.once('twitch:say', function(response) {
				assert.deepEqual(response[0], _response[0]);
				assert.include(response[1], _response[1]);

				// Pull out the number (at the end of the string)
				var line = response[1].split(' ');
				var result = parseInt(line[line.length-1]);
				assert.isAtLeast(result, 1);
				assert.isAtMost(result, 3);
				done();
			});

			eventbus.emit('random:dice', user, parameters);
		});
	});
	describe('Coin', function() {
		it('Contains settings for !coin', function() {
			assert.notEqual(Random.triggers, null);
			assert.equal(Random.triggers[0].name, 'coin');
			assert.equal(Random.triggers[0].type, 'chat');
			assert.equal(Random.triggers[0].whitelist, null);
			assert.equal(Random.triggers[0].event, 'random:coin');
		});
		it('No Parameters: Flips heads or tails', function(done) {
			var user = 'bdickason';
			var parameters = null;

			var _response = [];
			_response.push(strings.coin.flipping);
			_response.push(strings.coin.result);

			var _results = [strings.coin.heads, strings.coin.tails];

			eventbus.once('twitch:say', function(response) {
				assert.deepEqual(response[0], _response[0]);
				assert.include(response[1], _response[1]);

				// Pull out heads/tails (at the end of the string)
				var line = response[1].split(' ');
				var result = line[line.length-1];
				assert.include(_results, result);
				done();
			});

			eventbus.emit('random:coin', user, parameters);
		});
		it('Parameters: Ignores parameters', function(done) {
			var user = 'bdickason';
			var parameters = 'words words omfg words!';

			var _response = [];
			_response.push(strings.coin.flipping);
			_response.push(strings.coin.result);

			var _results = [strings.coin.heads, strings.coin.tails];

			eventbus.once('twitch:say', function(response) {
				assert.deepEqual(response[0], _response[0]);
				assert.include(response[1], _response[1]);

				// Pull out heads/tails (at the end of the string)
				var line = response[1].split(' ');
				var result = line[line.length-1];
				assert.include(_results, result);
				done();
			});

			eventbus.emit('random:coin', user, parameters);
		});
	});
});
