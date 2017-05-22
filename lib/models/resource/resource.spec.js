/* Test for lib/resource.js */

var assert = require('chai').assert;
var sinon = require('sinon');

var db = require('../../db');
db.connect('mode_staging');	// Do not remove this or you will wipe your data

// Pass in dummy token for testing
var Mixpanel = require('mixpanel');
var mixpanel = Mixpanel.init('test');

var Resource = require('.');
Resource.start(db, mixpanel);

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
							console.log(data);
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
		});/*
		it('errors if a non-number is provided', function() {

		});
		it('errors if an empty amount is provided', function() {

		}); */
	})
});
