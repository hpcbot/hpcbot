// /* Test for lib/log.js */

var assert = require('chai').assert;
var sinon = require('sinon');

var EventEmitter = require('events');
var eventbus = new EventEmitter;	// Temporary event bus to prevent events firing across files

var log = require('.');

describe('Logging Service', function() {
	beforeEach(function() {
	    this.sinon = sandbox = sinon.sandbox.create();
	});
	describe('Initiation', function() {
		it('No token: Doesn\'t fail if no token is passed', function() {
			log.start({events: eventbus});

      assert.isUndefined(log.options.token);
	 	});
		it('With Token: Initializes properly', function() {
			var _token = 'test-t0ken';

      log.start({events: eventbus, token: _token});

      assert.equal(log.options.token, _token);
		});
    it('No subdomain: Doesn\'t fail if no subdomain is passed', function() {
      log.start({events: eventbus});

      assert.isUndefined(log.options.subdomain);
    });
    it('No token: Doesn\'t fail if no token is passed', function() {
      var _subdomain = 'hpcbot.com';

      log.start({events: eventbus, subdomain: _subdomain});

      assert.equal(log.options.subdomain, _subdomain);
    });
	})
	afterEach(function() {
	    sandbox.restore();
	});
})
