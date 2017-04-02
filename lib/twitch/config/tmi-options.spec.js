/* Test for config/tmi-options.js */

var assert = require('chai').assert;

// Needed for test
var fs = require('fs');	// Used to check if file exists

// Dependencies
require('dotenv').config();	// Load environment variables from .env
var config = require("./tmi-options.js");

// describe('.env file which stores config info', function() {
	// it('exists', function() {
		// assert.ok(fs.existsSync('.env'));
	// });
// });

describe('options variable', function() {
	it('exists', function() {
		assert.ok(config.options);
	});
});


describe('Twitch Username', function() {
	var username = config.options.identity.username;

	it('is defined in the env file', function() {
		assert.ok(process.env.HPC_USERNAME);
	});

	it('is set properly in the options variable', function() {
		assert.ok(username);
	});

	it('matches the env variable', function() {
		assert.equal(username, process.env.HPC_USERNAME);
	})
})

describe('Twitch Password', function() {
	var password = config.options.identity.password;

	it('is defined in the env file', function() {
		assert.ok(process.env.HPC_PASSWORD);
	});

	it('is set properly in the options variable', function() {
		assert.ok(password);
	});

	it('matches the env variable', function() {
		assert.equal(password, process.env.HPC_PASSWORD);
	});

	it('begins with the string "oauth:"', function() {
		assert.equal('oauth:', password.substring(0, 6));
	});
})

describe('Twitch Chat Channel', function() {
	var channel = config.options.channels[0];

	it('is defined in the env file', function() {
		assert.ok(process.env.HPC_CHANNEL);
	});

	it('is set properly in the options variable', function() {
		assert.ok(channel);
	});

	it('matches the env variable', function() {
		assert.equal(channel, process.env.HPC_CHANNEL);
	});

	it('begins with a # sign', function() {
		assert.equal('#', channel.substring(0, 1));
	});
})