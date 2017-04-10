/* Test for join.js */

var assert = require('chai').assert;
var sinon = require('sinon');

var strings = require('../../../config/strings.json');

var EventEmitter = require('events');
var eventbus = new EventEmitter;	// Temporary event bus to prevent events firing across files

var db;
var dbStub;
var join;


describe('Join', function() {
	beforeEach(function() {
	    this.sinon = sandbox = sinon.sandbox.create();

	    // Stub out DB
	    var db = require('../../db');
		db.connect('mode_staging');	// Do not remove this or you will wipe your data
		dbStub = this.sinon.stub(db, 'get');

		var Join = require('.');
		join = Join.start(eventbus, dbStub);
	});
	it('add: Creates a new user if one doesn\'t exist', function(done) {
		var _username = 'bdickason';
		var _response = strings.join.welcome + _username + strings.join.new_here;
		

		// Setup stub for hgetall
		var hgetallStub = this.sinon.stub();		// Create a stub for the hget function (db.get().hget)
		dbStub.hgetall = hgetallStub;

		var tmpUser = {};	// Returns empty set
		hgetallStub.yields(null, tmpUser);

		// Setup stub for incr
		var incrStub = this.sinon.stub();		// Create a stub for the hget function (db.get().hget)
		dbStub.incr = incrStub;

		incrStub.yields(null, 1);

		// Setup stub for hmset
		var hmsetStub = this.sinon.stub();		// Create a stub for the hget function (db.get().hget)
		dbStub.hmset = hmsetStub;

		hmsetStub.yields(null, 1);

		// Setup stub for hmset
		var hsetStub = this.sinon.stub();		// Create a stub for the hget function (db.get().hget)
		dbStub.hset = hsetStub;

		hsetStub.yields(null, 1);


		eventbus.once('twitch:say', function(response) {
			assert.equal(response.length, 1);	// Response should only be one line
			assert.deepEqual(response[0], _response);
			done();
		});

		eventbus.emit('user:join', _username);

	});

	it('add: Doesn\'t create a new user if one exists', function() {
		var _username = 'bdickason';

		// Setup stub for hgetall
		var hgetallStub = this.sinon.stub();		// Create a stub for the hget function (db.get().hget)
		dbStub.hgetall = hgetallStub;

		var tmpUser = {
			"uid": 0,
			"house": "muggle"
		};

		hgetallStub.yields(null, tmpUser);

		// Setup stub for incr
		var incrStub = this.sinon.stub();		// Create a stub for the hget function (db.get().hget)
		dbStub.incr = incrStub;

		incrStub.yields(null, 1);

		// Setup stub for hmset
		var hmsetStub = this.sinon.stub();		// Create a stub for the hget function (db.get().hget)
		dbStub.hmset = hmsetStub;

		hmsetStub.yields(null, 1);

		// Setup stub for hmset
		var hsetStub = this.sinon.stub();		// Create a stub for the hget function (db.get().hget)
		dbStub.hset = hsetStub;

		hsetStub.yields(null, 1);

		var spy = this.sinon.spy();
		eventbus.once('twitch:say', spy);

		eventbus.emit('user:join', _username);
		this.sinon.assert.notCalled(spy);

	});
	
	afterEach(function() {
	    sandbox.restore();
	});

});
