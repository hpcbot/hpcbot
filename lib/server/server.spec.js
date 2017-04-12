/* Test for lib/chat.js */

var assert = require('chai').assert;

var EventEmitter = require('events');
var eventbus = new EventEmitter;	// Temporary event bus to prevent events firing across files

var Server = require('.');
var server = Server.start(eventbus);

describe('Server', function() {
});
