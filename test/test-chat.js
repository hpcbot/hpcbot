/* Test for lib/chat.js */

var assert = require('assert');

var chat = require('../lib/chat.js');

describe('Chat parser', function() {
	it('Ignores an empty command', function() {
		var userstate = {};
		var message = "";
		var self=false;

		chat.command(userstate, message, self, function(response) {
			assert.equal(response, null);
		});
	});

	describe('!sortinghat', function() {
		it('Ignores the command by itself', function() {
			var self=true;
			var userstate = {};
			var message ="!sortinghat";

			chat.command(userstate, message, self, function(response) {
				assert.equal(response, null);
			});
		});

		it('Ignores the command by itself', function() {
			var userstate = {
				username: "bdickason"
			};
			var message ="!sortinghat test";
			var self=false;

			var _response = "bdickason is a muggle!";	// Expected Response

			chat.command(userstate, message, self, function(response) {
				assert.equal(response, _response);
			});
		});

	});
});

