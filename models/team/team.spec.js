/* Test for lib/team.js */

var assert = require('chai').assert;
var sinon = require('sinon');

var db = require('../../db');
db.connect('mode_staging');	// Do not remove this or you will wipe your data

var EventEmitter = require('events');
var eventbus = new EventEmitter;	// Temporary event bus to prevent events firing across files

var Team = require('.');
Team.start(db, eventbus);

describe('Team', function() {
	beforeEach(function(done) {
		// Wipe database before running tests. Note: Make _SURE_ you are on staging
		db.get().flushdb(function(err) {
			if(!err) {
				done();
			}
		});
	});
	describe('Gets a single house score', function() {
		it('Returns the score for a single house', function(done) {
			var house = 'Gryffindor';
			var amount = 10;

			var _data = 10;

			db.get().hset('cup', house, amount, function(err, data) {
				if(!err) {
					Team.get(house, function(err, data) {
						assert.equal(data, _data);
						done();
					});

				}
			});
		});
	});
	describe('Gets all houses scores', function() {
		it('Returns the score for a single house', function(done) {
			var _data = {
				'Gryffindor': '5',
				'Hufflepuff': '7',
				'Ravenclaw': '10',
				'Slytherin': '15'
			};

			db.get().hmset('cup', 'Gryffindor', 5, 'Hufflepuff', 7, 'Ravenclaw', 10, 'Slytherin', 15, function(err, data) {
				if(!err) {
					Team.getAll(function(err, data) {
						assert.deepEqual(data, _data);
						done();
					});
				}
			});
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
		var house;
		beforeEach(function() {
			house = 'Gryffindor';
		});

		it('accepts and stores an amount when a house has no score', function(done) {
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
	describe('remove points from a house', function() {
		var house;
		beforeEach(function() {
			house = 'Gryffindor';
		});
		it('accepts and stores an amount when a house has no score', function(done) {
			var amount = 15;
			var _amount = -15;

			Team.remove(house, amount, function(err, data) {
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
			var amount = 15;

			var _amount = -5;	// House starts with 10 points

			// Setup a dummy house with 10 points
			db.get().hset('cup', house, '10', function(err, data) {
					if(!err) {
						Team.remove(house, amount, function(err, data) {
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
			var amount = -15;

			var _err = 'amount must be greater than zero'
			Team.remove(house, amount, function(err, data) {
				// Verify that final sum is returned
				assert.equal(err, _err);
				assert.equal(data, null);
				done();
			});
		});
		it('errors if zero is provided', function(done) {
			var amount = 0;

			var _err = 'no amount provided';
			Team.remove(house, amount, function(err, data) {
				// Verify that final sum is returned
				assert.equal(err, _err);
				assert.equal(data, null);
				done();
			});
		});
		it('errors if a non-number is provided', function(done) {
			var amount = 'test';

			var _err = 'amount must be a number';
			Team.remove(house, amount, function(err, data) {
				// Verify that final sum is returned
				assert.equal(err, _err);
				assert.equal(data, null);
				done();
			});
		});
		it('errors if an empty amount is provided', function(done) {
			var amount = null;

			var _err = 'no amount provided';
			Team.remove(house, amount, function(err, data) {
				// Verify that final sum is returned
				assert.equal(err, _err);
				assert.equal(data, null);
				done();
			});
		});
	});

});
