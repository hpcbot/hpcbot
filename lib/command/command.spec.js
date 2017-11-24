/* Test for lib/chat.js */

var assert = require('chai').assert;

var EventEmitter = require('events');
var eventbus = new EventEmitter;	// Temporary event bus to prevent events firing across files

describe('Commands', function() {
	describe('start()', function() {
    it('No parameters: Starts properly', function() {
      var command = require('.');

      var _whitelist = [];
      var _events = typeof(eventbus);

      command.start();

      assert.deepEqual(command.options.whitelist, _whitelist);
      assert.equal(typeof(command.options.events), _events)
    });
    it('Full parameters: Set properly', function() {
      var command = require('.');

      var _whitelist = ['blah', 'blah2'];
      var _events = eventbus;

      command.start({ whitelist: _whitelist, events: _events});

      assert.deepEqual(command.options.whitelist, _whitelist);
      assert.deepEqual(command.options.events, _events)
    });
  });
  describe('add()', function() {
    var command;
    beforeEach(function() {
      command = require('.');
      command.start(eventbus);
    })
    it('No parameters: Throws an error', function() {
      assert.throws(function() {
        command.add() }, Error, 'Cannot read property \'name\' of undefined');
    });
    it('Single Command: Adds 1 correctly', function(done) {
      var _command = {
        name: 'blah',
        type: 'chat'
      };

      command.add(_command);

      eventbus.once('command:blah', function() {
        assert.equal(command.list().length, 1);
        assert.deepEqual(command.list(), [_command]);
        done();
      });

      eventbus.emit('chat:blah');
    });
    it('Multiple Command: Adds 2 correctly', function(done) {
      var _command = [{
        name: 'blah',
        type: 'chat'
      }, {
        name: 'whatever',
        type: 'whisper'
      }];

      command.add(_command);

      eventbus.once('command:blah', function() {
        assert.equal(command.list().length, 2);
        assert.deepEqual(command.list(), _command);
        done();
      });

      eventbus.emit('chat:blah');

    });
    afterEach(function() {
      command.clear();
    });
  });

     /*
		it('Starts with no options (all defaults)', function() {
			command.start();

			var _hostname = 'localhost';
			var _port = 3000;
			var _directory = '/';
			var _viewEngine = 'pug';
			var _events = new EventEmitter();

			// Verify defaults
			var options = overlays.options;

			assert.notEqual(options, null);
			assert.equal(options.hostname, _hostname);
			assert.equal(options.port, _port);
			assert.equal(options.directory, _directory);
			assert.equal(options.viewEngine, _viewEngine)
			assert.deepEqual(options.events, _events);
		});

		it('Starts with all options (no defaults)', function() {
			var options = {
				hostname: 'test.com',
				port: 3500,
				directory: '/test',
				viewEngine: 'jade',
				events: eventbus
			}

			options.events.test = 'test';

			var _hostname = 'test.com';
			var _port = 3500;
			var _directory = '/test';
			var _viewEngine = 'jade';
			var _events = eventbus;

			overlays.start(options);

			// Verify defaults
			var options = overlays.options;

			assert.notEqual(options, null);
			assert.equal(options.hostname, _hostname);
			assert.equal(options.port, _port);
			assert.equal(options.directory, _directory);
			assert.equal(options.viewEngine, _viewEngine)
			assert.equal(typeof(options.events), typeof(_events));
		});
	});
	describe('add() - Load Overlays', function() {
		beforeEach(function() {
			overlays.clear();	// Clear the list of overlays to reset the module
		})
		it('Loads a single overlay', function() {
			overlays.start({events: eventbus});

			var overlay = {
		    name: 'hpcwins',
		    type: 'video',
		    file: 'overlays/events/hpcwins.mp4'
			}

			var _template = {
				name: 'hpcwins',
				view: 'video.pug',
				selector: '#hpcwins',
				directory: 'overlays/events'
			};

			var _payload = {
				video: 'hpcwins.mp4'
			};

			overlays.add(overlay);
			var list = overlays.list();

			assert.equal(list.length, 1);
			assert.equal(list[0].template.name, _template.name);
			assert.include(list[0].template.view, _template.view);
			assert.equal(list[0].template.selector, _template.selector);
			assert.equal(list[0].template.directory, _template.directory);
			assert.deepEqual(list[0].payload, _payload);
		});
		it('Loads an array of overlays', function() {
			overlays.start({events: eventbus});

			var overlay = [{
				name: 'powermove',
				type: 'video',
				file: 'overlays/events/powermove.mp4'
			}, {
				name: 'hpcwins',
				type: 'video',
				file: 'overlays/events/hpcwins.mp4'
			}];

			var _template = {
				name: 'hpcwins',
				view: 'video.pug',
				selector: '#hpcwins',
				directory: 'overlays/events'
			};

			var _payload = {
				video: 'hpcwins.mp4'
			};

			overlays.add(overlay);
			var list = overlays.list();

			assert.equal(list.length, 2);
			assert.equal(list[1].template.name, _template.name);
			assert.include(list[1].template.view, _template.view);
			assert.equal(list[1].template.selector, _template.selector);
			assert.equal(list[1].template.directory, _template.directory);
			assert.deepEqual(list[1].payload, _payload);
		}); */
});
