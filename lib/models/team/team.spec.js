/* Test for lib/team.js */

var assert = require('chai').assert;
var sinon = require('sinon');

var db = require('../../db');
db.connect('mode_staging');	// Do not remove this or you will wipe your data

// Pass in dummy token for testing
var Mixpanel = require('mixpanel');
var mixpanel = Mixpanel.init('test');

var Team = require('.');
Team.start(db, mixpanel);

describe('Team', function() {
	beforeEach(function(done) {
		// Wipe database before running tests. Note: Make _SURE_ you are on staging
		db.get().flushdb(function(err) {
			if(!err) {
				done();
			}
		});
	});
	describe('resets the house cup', function() {
		it('Sets scores to zero for a new cup', function(done) {
			var _saved = ['0', '0', '0', '0'];

			var _data = true;

			Team.reset(function(err, data) {
				if(!err) {
					assert.equal(data, _data); // Operation should complete successfully

					db.get().hmget('cup', 'Gryffindor', 'Hufflepuff', 'Ravenclaw', 'Slytherin', function(err, data) {
						if(!err) {
							assert.deepEqual(data, _saved);
							done();
						}
						else {
							console.log(err);
						}
					});
				}
				else {
					console.log(err);
				}
			})
		});

		it('Wipes scores to zero if a cup already exists', function(done) {
			var _saved = ['0', '0', '0', '0'];

			var _data = true;

			db.get().mset(
				'cup:Gryffindor', 5,
				'cup:Hufflepuff', 4,
				'cup:Ravenclaw', 3,
				'cup:Slytherin', 2, function(err, data) {
				if(!err) {
					Team.reset(function(err, data) {
						if(!err) {
							assert.equal(data, _data); // Operation should complete successfully

					db.get().hmget('cup', 'Gryffindor', 'Hufflepuff', 'Ravenclaw', 'Slytherin', function(err, data) {
								if(!err) {
									assert.deepEqual(data, _saved);
									done();
								}
								else {
									console.log(err);
								}
							});
						}
						else {
							console.log(err);
						}
					})

				}
				else {
					callback(err, null);
				}
			});
		});
	});

	describe('add points to a house', function() {
		it('accepts and stores an amount when a house has no score', function(done) {
			var house = 'Gryffindor';
			var amount = 15;

			var _amount = 15;

			Team.add(house, amount, function(err, data) {
				// Verify that final sum is returned
				assert.equal(data, _amount);
				// Make sure the user has resources associated in the db
				db.get().hget('cup', house, function(err, data) {
					assert.equal(err, null);
					assert.equal(data, _amount);
					done();
				});
			});
		});
		it('accepts and stores a number when a house has a score', function(done) {
			var house = 'Gryffindor';
			var amount = 15;

			var _amount = 25;	// House starts with 10 points

			// Setup a dummy house with 10 points
			db.get().hset('cup', house, '10', function(err, data) {
					if(!err) {
						Team.add(house, amount, function(err, data) {
							// Verify that final sum is returned

							assert.equal(data, _amount);
							// Make sure the house has a score associated in the db

							db.get().hget('cup', house, function(err, data) {
								assert.equal(err, null);
								assert.equal(data, _amount);
								done();
							});
						});
					}
				});
			});

		it('errors if negative number is provided', function(done) {
			var house = 'Gryffindor';
			var amount = -15;

			var _err = 'amount must be greater than zero'
			Team.add(house, amount, function(err, data) {
				// Verify that final sum is returned
				assert.equal(err, _err);
				assert.equal(data, null);
				done();
			});
		});
		it('errors if zero is provided', function(done) {
			var house = 'Gryffindor';
			var amount = 0;

			var _err = 'no amount provided';
			Team.add(house, amount, function(err, data) {
				// Verify that final sum is returned
				assert.equal(err, _err);
				assert.equal(data, null);
				done();
			});
		});
		it('errors if a non-number is provided', function(done) {
			var house = 'Gryffindor';
			var amount = 'test';

			var _err = 'amount must be a number';
			Team.add(house, amount, function(err, data) {
				// Verify that final sum is returned
				assert.equal(err, _err);
				assert.equal(data, null);
				done();
			});
		});
		it('errors if an empty amount is provided', function(done) {
			var house = 'Gryffindor';
			var amount = null;

			var _err = 'no amount provided';
			Team.add(house, amount, function(err, data) {
				// Verify that final sum is returned
				assert.equal(err, _err);
				assert.equal(data, null);
				done();
			});
		});
	});

	/*
	describe('take resources', function() {
		// Uses same function as give, but negative
		it('takes a number away from a user\'s gold', function(done) {
			var username = 'bdickason';
			var amount = 15;

			var _amount = -5;	// User starts with 10 resources

			// Setup a dummy user with 10 resources
			db.get().hset('user:' + username, 'resource', '10', function(err, data) {
				db.get().hset('resources', username, '10', function(err, data) {
					if(!err) {
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
					}
				});
			});
		});
		it('does not accept a negative number', function(done) {
			var username = 'bdickason';
			var amount = -15;

			var _amount = null;	// User starts with 10 resources
			var _err = 'amount must be greater than zero';

			// Setup a dummy user with 10 resources
			db.get().hset('user:' + username, 'resource', '10', function(err, data) {
				db.get().hset('resources', username, '10', function(err, data) {
					if(!err) {
						Resource.take(username, amount, function(err, data) {
							// Verify that final sum is returned
							assert.equal(data, _amount);
							assert.equal(err, _err);
							done();
						});
					};
				});
			});
		});
	});
	describe('get a user\'s resources', function() {
		it('returns a single user\'s resources' , function(done) {
			var username = 'bdickason';
			var amount = 15;

			var _amount = 15;

			// Setup a dummy user with 10 resources
			db.get().hset('user:' + username, 'resource', '15', function(err, data) {
				db.get().hset('resources', username, '15', function(err, data) {
					if(!err) {
						Resource.get(username, function(err, data) {
							// Verify that final sum is returned
							assert.equal(data, _amount);
							// assert.equal(err, _err);
							done();
						});
					};
				});
			});
		});
		it('returns zero if the user has never had any resources' , function(done) {
			var username = 'bdickason';

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
	}); */
});
