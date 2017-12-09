/* Test for models/playlist.js */

var assert = require('chai').assert;
var sinon = require('sinon');

var db = require('../../lib/db');
db.connect('mode_staging');	// Do not remove this or you will wipe your data

var EventEmitter = require('events');
var eventbus = new EventEmitter;	// Temporary event bus to prevent events firing across files

var chance;
var intStub;
var shuffStub;

var Playlist;

describe('Playlist', function() {
	beforeEach(function(done) {
		this.sinon = sandbox = sinon.sandbox.create();

		chance = {
			integer: function(){
			},
			shuffle: function(){
			}
		};

		// Stub out random number generation
		intStub = this.sinon.stub(chance, 'integer');
		shufStub = this.sinon.stub(chance, 'shuffle');

		Playlist = require('.');
		Playlist.start(db, chance);

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
						assert.equal(err, 'That song already exists');
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
			it('removing the currently selected video nexts to the next song first', function(done) {
				var videoId = 'asdf3adc';
				var songs = ['A2h2YrfcJ4Y', 'asdf3adc', 'kAJD342mkamc'];

				var _songs = ['A2h2YrfcJ4Y', 'kAJD342mkamc'];
				var _videoId = 'kAJD342mkamc';

				db.get().rpush('playlist', songs, function(err, data) {
					Playlist.play(videoId, function(err, data) {
						Playlist.remove(videoId, function(err, data) {
							Playlist.state(function(err, state) {
								assert.equal(err, null);
								assert.equal(state.videoId, _videoId);
								assert.deepEqual(state.songs, _songs);
								done();
							});
						});
					});
				});
			});
		});
		describe('next', function() {
			it('not at end: nexts to next song', function(done) {
				var song = 'asdf3adc';

				var _songs = ['A2h2YrfcJ4Y', 'asdf3adc', 'kAJD342mkamc'];
				var _nextSong = 'kAJD342mkamc';

				Playlist.add(_songs, function(err, success) {
					if(!err) {
						Playlist.play(song, function(err, success) {
							if(!err) {
								Playlist.next(function(err, success) {
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
								Playlist.next(function(err, success) {
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
		describe('shuffle', function() {
			it('shuffles a list and updates the currently playing track', function(done) {
				var videoId = 'v';
				var _songs = ['q', 'v', 'd']


				var _shuffleResponse = ['v', 'd', 'q'];	// Randomized tracks
				var _integerResponse = 2;	// Play the second song in the list

				shufStub.returns(_shuffleResponse);
				intStub.returns(_integerResponse);

				Playlist.add(_songs, function(err, success) {
					if(!err) {
						Playlist.play(videoId, function(err, success) {
							if(!err) {
								Playlist.shuffle(function(err, success) {
									if(!err) {
										Playlist.state(function(err, state) {
											if(!err) {
												assert.deepEqual(state.songs, _shuffleResponse);
												assert.equal(state.videoId, _shuffleResponse[_integerResponse]);
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
		describe('reorder', function() {
			// Swaps the order of two songs in the playlist
			// Input: start (#), end (#)
			// Output: error, success
			it('swaps the position for two songs in a list', function(done) {
				var start = 2;
				var end = 0;
				var songs = ['12341', '5555', '7777'];

				var _videoId = '12341';
				var _songs = ['7777', '5555', '12341'];

				Playlist.add(songs, function(err, success) {
					if(!err) {
						Playlist.play(_videoId, function(err, success) {
							Playlist.reorder(start, end, function(err, success) {
								if(!err) {
									Playlist.state(function(err, state) {
										assert.equal(state.videoId, _videoId);
										assert.deepEqual(state.songs, _songs);
										done();
									})
								}
							});
						});
					}
				});
			});
		})
		describe('addAfter', function() {
			// Adds after an existing item
			// Input: videoId, after_videoId
			// Output: error, success
			it('Song exists in list: Adds after a song that exists', function(done) {
				var songs = ['12341', '5555', '7777'];
				var videoId = '12341';

				var newVideoId = '5151';
				var afterId = '5555';

				var _songs = ['12341', '5555', '5151', '7777'];

				Playlist.add(songs, function(err, success) {
					if(!err) {
						Playlist.play(videoId, function(err, success) {
							Playlist.addAfter(newVideoId, afterId, function(err, success) {
								if(!err) {
									Playlist.state(function(err, state) {
										assert.equal(state.videoId, videoId);
										assert.deepEqual(state.songs, _songs);
										done();
									})
								}
							});
						});
					}
				});
			});
			it('Song doesn\'t exist in list Adds after currently playing song', function(done) {
				var songs = ['12341', '5555', '7777'];
				var videoId = '12341';

				var newVideoId = '5151';
				var afterId = '3849';

				var _songs = ['12341', '5151', '5555', '7777'];

				Playlist.add(songs, function(err, success) {
					if(!err) {
						Playlist.play(videoId, function(err, success) {
							Playlist.addAfter(newVideoId, afterId, function(err, success) {
								if(!err) {
									Playlist.state(function(err, state) {
										assert.equal(state.videoId, videoId);
										assert.deepEqual(state.songs, _songs);
										done();
									})
								}
							});
						});
					}
				});
			});
		})
	});
	afterEach(function() {
		sandbox.restore();
	});
});
