/* Test for models/playlist.js */

var assert = require('chai').assert;
var sinon = require('sinon');

var db = require('../../lib/db');
db.connect('mode_staging');	// Do not remove this or you will wipe your data

var EventEmitter = require('events');
var eventbus = new EventEmitter;	// Temporary event bus to prevent events firing across files

var Playlist = require('.');
Playlist.start(db, eventbus);

describe('Playlist', function() {
	beforeEach(function(done) {
		// Wipe database before running tests. Note: Make _SURE_ you are on staging
		db.get().flushdb(function(err) {
			if(!err) {
				done();
			}
		});
	});
	describe('Music playlist', function() {
		describe('add', function() {
			it('adds a valid youtube song to an empty list', function(done) {
				var song = 'A2h2YrfcJ4Y';

				var _success = true;
				var _amount = 1;

				Playlist.add(song, function(err, success) {
					// Verify that final sum is returned
					assert.equal(success, _success);
					// Make sure the song exists in the list
					db.get().lrange('playlist', '0', '-1', function(err, data) {
						assert.equal(err, null);
						assert.equal(data.length, _amount);
						assert.equal(data[0], song);
						done();
					});
				});
			});
			it('adds a valid youtube song to the end of a full list', function(done) {
				var song = 'A2h2YrfcJ4Y';

				var _success = true;
				var _amount = 4;

				db.get().rpush('playlist', ['kajdsklfja', 'aksdljfklajf', 'jaksdjfklaj'], function(err, data) {
					Playlist.add(song, function(err, success) {
						// Verify that final sum is returned
						assert.equal(success, _success);
						// Make sure the song exists in the list
						db.get().lrange('playlist', '0', '-1', function(err, data) {
							assert.equal(err, null);
							assert.equal(data.length, _amount);
							assert.equal(data[3], song);
							done();
						});
					})
				});
			});
			it('does not add a duplicate song to the list', function(done) {
				var song = 'kajdsklfja';

				var _amount = 3;

				var _playlist = ['kajdsklfja', 'aksdljfklajf', 'jaksdjfklaj']

				db.get().rpush('playlist', _playlist, function(err, data) {
					Playlist.add(song, function(err, success) {
						// Should return an error that item already exists
						assert.equal(err, 'Song already exists');
						assert.equal(success, null);
						// Make sure list was not modified
						db.get().lrange('playlist', '0', '-1', function(err, data) {
							assert.equal(err, null);
							assert.equal(data.length, _amount);
							assert.deepEqual(data, _playlist)
							done();
						});
					})
				});
			});
		});
		describe('get', function() {
			it('returns a list with a few items', function(done) {
				var _songs = ['A2h2YrfcJ4Y', 'asdf3adc', 'kAJD342mkamc'];

				var _success = true;
				var _amount = 3;

				db.get().rpush('playlist', _songs, function(err, data) {
					Playlist.get(function(err, songs) {
						assert.equal(err, null);
						assert.equal(songs.length, _amount);
						assert.deepEqual(songs, _songs);
						done();
					});
				});
			});
			it('returns an empty list if no items exist', function(done) {
				var _songs = [];

				var _success = true;
				var _amount = 0;

				Playlist.get(function(err, songs) {
					assert.equal(err, null);
					assert.equal(songs.length, _amount);
					assert.deepEqual(songs, _songs);
					done();
				});
			});
		});
		describe('play', function() {
			it('sets the currently playing song', function(done) {
				var song = 'asdf3adc';

				var _songs = ['A2h2YrfcJ4Y', 'asdf3adc', 'kAJD342mkamc'];

				var _success = true;

				db.get().rpush('playlist', _songs, function(err, data) {
					Playlist.play(song, function(err, success) {
						assert.equal(err, null);
						assert.equal(success, _success);
						db.get().hget('current', 'song', function(err, data) {
							assert.equal(song, data);
							done();
						});
					});
				});
			});
		});
		describe('state', function() {
			it('returns all expected variables', function(done) {
				var videoId = 'asdf3adc';
				var songs = ['A2h2YrfcJ4Y', 'asdf3adc', 'kAJD342mkamc'];

				var _success = true;

				db.get().rpush('playlist', songs, function(err, data) {
					db.get().hset('current', 'song', videoId, function(err, data) {
						Playlist.state(function(err, state) {
							assert.equal(err, null);
							assert.equal(state.videoId, videoId);
							assert.deepEqual(state.songs, songs);
							done();
						});
					});
				});
			});
		});
		describe('remove', function() {
			it('removes an item when it exists in the list', function(done) {
				var videoId = 'asdf3adc';
				var songs = ['A2h2YrfcJ4Y', 'asdf3adc', 'kAJD342mkamc'];

				var _songs = ['A2h2YrfcJ4Y', 'kAJD342mkamc'];
				var _success = true;

				db.get().rpush('playlist', songs, function(err, data) {
					Playlist.remove(videoId, function(err, data) {
						assert.equal(err, null);
						assert.equal(data, true);
						db.get().lrange('playlist', 0, -1, function(err, data) {
							assert.equal(err, null);
							assert.deepEqual(data, _songs);
							done();
						});
					});
				});
			});
		});
		describe('skip', function() {
			it('not at end: skips to next song', function(done) {
				var song = 'asdf3adc';

				var _songs = ['A2h2YrfcJ4Y', 'asdf3adc', 'kAJD342mkamc'];
				var _nextSong = 'kAJD342mkamc';

				Playlist.add(_songs, function(err, success) {
					if(!err) {
						Playlist.play(song, function(err, success) {
							if(!err) {
								Playlist.skip(function(err, success) {
									if(!err) {
										Playlist.state(function(err, state) {
											if(state) {
												assert.deepEqual(state.songs, _songs);
												assert.equal(state.videoId, _nextSong);
												done();
											}
										});
									}
								});
							}
						});
					}
				});
			});
			it('end of list: goes back to the start', function(done) {
				var song = 'kAJD342mkamc';

				var _songs = ['A2h2YrfcJ4Y', 'asdf3adc', 'kAJD342mkamc'];
				var _nextSong = 'A2h2YrfcJ4Y';

				Playlist.add(_songs, function(err, success) {
					if(!err) {
						Playlist.play(song, function(err, success) {
							if(!err) {
								Playlist.skip(function(err, success) {
									if(!err) {
										Playlist.state(function(err, state) {
											if(state) {
												assert.deepEqual(state.songs, _songs);
												assert.equal(state.videoId, _nextSong);
												done();
											}
										});
									}
								});
							}
						});
					}
				});
			});
		});
		describe('validateInput', function() {
			it('passes a song ID through', function() {
				var song = 'A2h2YrfcJ4Y'
				var _song = 'A2h2YrfcJ4Y'

				song = Playlist.validateInput(song);

				assert.equal(song, _song);
			});
			it('removes the youtube URL from the start', function() {
				var song = 'https://www.youtube.com/watch?v=VT2W3U8wYQg'
				var _song = 'VT2W3U8wYQg'

				song = Playlist.validateInput(song);

				assert.equal(song, _song);
			})
		})
	});
});
