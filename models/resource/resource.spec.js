/* Test for lib/resource.js */

var assert = require('chai').assert;
var sinon = require('sinon');

var db = require('../../lib/db');
db.connect('mode_staging');	// Do not remove this or you will wipe your data

var EventEmitter = require('events');
var eventbus = new EventEmitter;	// Temporary event bus to prevent events firing across files

var Resource = require('.');
Resource.start(db, eventbus);

describe('Resource', function() {
	beforeEach(function(done) {
		// Wipe database before running tests. Note: Make _SURE_ you are on staging
		db.get().flushdb(function(err) {
			if(!err) {
				done();
			}
		});
	});
	describe('give resources', function() {
		it('accepts and stores a number when a user has no gold', function(done) {
			var username = 'bdickason';
			var amount = 15;

			var _amount = 15;

			Resource.give(username, amount, function(err, data) {
				// Verify that final sum is returned
				assert.equal(data, _amount);
				// Make sure the user has resources associated in the db
				db.get().hget('user:' + username, 'resource', function(err, data) {
					assert.equal(err, null);
					assert.equal(data, _amount);
					db.get().hget('resources', username, function(err, data) {
						assert.equal(err, null);
						assert.equal(data, _amount);
						done();
					});
				});
			});
		});
		it('accepts and stores a number when a user has gold', function(done) {
			var username = 'bdickason';
			var amount = 15;

			var _amount = 25;	// User starts with 10 resources

			// Setup a dummy user with 10 resources
			db.get().hset('user:' + username, 'resource', '10', function(err, data) {
				db.get().hset('resources', username, '10', function(err, data) {
					if(!err) {
						Resource.give(username, amount, function(err, data) {
							// Verify that final sum is returned

							assert.equal(data, _amount);
							// Make sure the user has resources associated in the db
							db.get().hget('user:' + username, 'resource', function(err, data) {
								assert.equal(err, null);
								assert.equal(data, _amount);
								db.get().hget('resources', username, function(err, data) {
									assert.equal(err, null);
									assert.equal(data, _amount);
									done();
								});
							});
						});
					}
				});
			});
		});
		it('errors if negative number is provided', function(done) {
			var username = 'bdickason';
			var amount = -15;

			var _err = 'amount must be greater than zero'
			Resource.give(username, amount, function(err, data) {
				// Verify that final sum is returned
				assert.equal(err, _err);
				assert.equal(data, null);
				done();
			});
		});
		it('errors if zero is provided', function(done) {
			var username = 'bdickason';
			var amount = 0;

			var _err = 'no amount provided';
			Resource.give(username, amount, function(err, data) {
				// Verify that final sum is returned
				assert.equal(err, _err);
				assert.equal(data, null);
				done();
			});
		});
		it('errors if a non-number is provided', function(done) {
			var username = 'bdickason';
			var amount = 'test';

			var _err = 'amount must be greater than zero';
			Resource.give(username, amount, function(err, data) {
				// Verify that final sum is returned
				assert.equal(err, _err);
				assert.equal(data, null);
				done();
			});
		});
		it('errors if an empty amount is provided', function(done) {
			var username = 'bdickason';
			var amount = null;

			var _err = 'no amount provided';
			Resource.give(username, amount, function(err, data) {
				// Verify that final sum is returned
				assert.equal(err, _err);
				assert.equal(data, null);
				done();
			});
		});
	});
	describe('take resources', function() {
		var username = 'bdickason';
		beforeEach('Setup a dummy user with 10 resources', function(done) {
			// Setup a dummy user with 10 resources
			db.get().hset('user:' + username, 'resource', '10', function(err, data) {
				db.get().hset('resources', username, '10', function(err, data) {
					if(!err) {
						done();
					}
				});
			});
		});
		// Uses same function as give, but negative
		it('takes a number away from a user\'s gold', function(done) {
			var amount = 15;

			var _amount = -5;	// User starts with 10 resources

			Resource.take(username, amount, function(err, data) {
				// Verify that final sum is returned

				assert.equal(data, _amount);
				// Make sure the user has resources associated in the db
				db.get().hget('user:' + username, 'resource', function(err, data) {
					assert.equal(err, null);
					assert.equal(data, _amount);
					db.get().hget('resources', username, function(err, data) {
						assert.equal(err, null);
						assert.equal(data, _amount);
						done();
					});
				});
			});

		});
		it('does not accept a negative number', function(done) {
			// var username = 'bdickason';
			var amount = -15;

			var _amount = null;	// User starts with 10 resources
			var _err = 'amount must be greater than zero';

			Resource.take(username, amount, function(err, data) {
				// Verify that final sum is returned
				assert.equal(data, _amount);
				assert.equal(err, _err);
				done();
			});
		});
	});
	describe('get a user\'s resources', function() {
		var username = 'bdickason';
		beforeEach('Setup a dummy user with 10 resources', function(done) {
			// Setup a dummy user with 10 resources
			db.get().hset('user:' + username, 'resource', '15', function(err, data) {
				db.get().hset('resources', username, '15', function(err, data) {
					if(!err) {
						done();
					}
				});
			});
		});

		it('returns a single user\'s resources' , function(done) {
			var amount = 15;

			var _amount = 15;

			Resource.get(username, function(err, data) {
				// Verify that final sum is returned
				assert.equal(data, _amount);
				// assert.equal(err, _err);
				done();
			});
		});
		it('returns zero if the user has never had any resources' , function(done) {
			var username='internetuser';
			var _amount = 0;
			var _err = null;

			Resource.get(username, function(err, data) {

				assert.equal(data, _amount);
				assert.equal(err, _err);
				done();
			});
		});
		it('throws an error if no username is passed in', function(done) {
			var username = null;

			var _amount = null;
			var _err = 'no user provided';

			// Setup a dummy user with 10 resources
			Resource.get(username, function(err, data) {
				// Verify that final sum is returned
				assert.equal(data, _amount);
				assert.equal(err, _err);
				done();
			});
		});
	});
	describe('giveMany() give resources to many users at once', () => {
		var users = ['bdickason', 'larry_manalo'];

		beforeEach('Setup up two dummy users with 10 resources', (done) => {
			// Setup a dummy user with 10 resources
			Resource.give(users[0], 15, (err, data) => {
				Resource.give(users[1], 15, (err, data) => {
					if(!err) {
						done()
					}
				})
			})
		});

		it('gives resources to both users' , (done) => {
			var amount = 10;

			var _data = 2;
			var _amount = 25;


			Resource.giveMany(users, amount, (err, data) => {
				// Verify that final sum is returned
				assert.equal(data, 2);
				db.get().hget('user:' + users[0], 'resource', (err, first) => {
					console.log(first)
					assert.equal(first, _amount)
					db.get().hget('user:' + users[1], 'resource', (err, second) => {
						console.log(second)
						assert.equal(second, _amount)
						done()
					})
				})
			});
		});
		it('gives resources to one user and a 3rd that doesn\'t exist yet' , (done) => {
			var amount = 10
			let newUsers = ['bdickason', 'teamalea']

			var _data = 2
			var _first = 25
			let _second = 10

			Resource.giveMany(newUsers, amount, (err, data) => {
				// Verify that final sum is returned
				assert.equal(data, 2);

				db.get().hget('user:' + newUsers[0], 'resource', (err, first) => {
					assert.equal(first, _first)

					db.get().hget('user:' + newUsers[1], 'resource', (err, second) => {
						assert.equal(second, _second)
						done()
					})
				})
			});
		});
		it('Throws an error if there are no users passed in' , function(done) {
			var newUsers = [];

			let _amount = null
			var _err = 'no users provided'

			Resource.giveMany(newUsers, 2, (err, data) => {
				assert.equal(data, _amount)
				assert.equal(err, _err)
				done()
			})
		})
		it('Throws an error if no amount is passed in' , function(done) {
			let amount = null

			let _amount = null
			var _err = 'no amount provided'

			Resource.giveMany(users, amount, (err, data) => {
				assert.equal(data, _amount)
				assert.equal(err, _err)
				done()
			})
		})
	});
});
