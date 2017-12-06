/* Test for models/song.js */

var assert = require('chai').assert;
var sinon = require('sinon');

var db = require('../../lib/db');
db.connect('mode_staging');	// Do not remove this or you will wipe your data

var EventEmitter = require('events');
var eventbus = new EventEmitter;	// Temporary event bus to prevent events firing across files

var youtube;	// Placeholder for youtube api object
var listStub;

var Song;

describe('Songs', function() {
	beforeEach(function(done) {
		this.sinon = sandbox = sinon.sandbox.create();

		youtube = {
			videos: {
				list: function() {
				}
			}
		};

		// Stub out video list
		listStub = this.sinon.stub(youtube.videos, 'list');

		Song = require('.');
		Song.start(db, {youtube: youtube, youtubeKey: ''});

		// Wipe database before running tests. Note: Make _SURE_ you are on staging
		db.get().flushdb(function(err) {
			if(!err) {
				done();
			}
		});
	});
	describe('get', function() {
		it('Returns metadata for a single song in the db', function(done) {
			var videoId = 'YolcxelpLtU';

			var _video = {
				title: 'Classixx - I\'ll Get You (Treasure Fingers Remix) [HD]',
				thumbnail: 'https://i.ytimg.com/vi/YolcxelpLtU/default.jpg',
				duration: '6:05'
			};
			db.get().hmset('song:' + videoId, _video, function(err, success) {
				Song.get(videoId, function(err, video) {
					assert.equal(err, null);
					assert.deepEqual(_video, video);
					done();
				});
			});
		});
		it('Returns an error if the song doesn\'t exist', function(done) {
			var videoId = 'YolcxelpLtU';

			Song.get(videoId, function(err, video) {
				assert.equal(err, 'Song does not exist');
				assert.equal(video, null)
				done();
			});
		});
	});
	describe('getList', function() {
		it('Returns a list of song metadata if an array is passed in', function(done) {
			var songs = ['kajdsklfja', 'aksdljfklajf', 'jaksdjfklaj'];

			var _songs = [{
				title: 'Title #1',
				thumbnail: 'Thumb #1.jpg',
				duration: '5:03'
			}, {
				title: 'Title #2',
				thumbnail: 'Thumb #2.jpg',
				duration: '3:50'
			}, {
				title: 'Title #3',
				thumbnail: 'Thumb #3.jpg',
				duration: '5:23'
			}];

			db.get().hmset('song:' + songs[0], _songs[0], function(err, success) {
				db.get().hmset('song:' + songs[1], _songs[1], function(err, success) {
					db.get().hmset('song:' + songs[2], _songs[2], function(err, success) {
						Song.getList(songs, function(err, metadata) {
							assert.equal(err, null);
							assert.deepEqual(metadata, _songs);
							done();
						});
					});
				});
			});
		});
	});
		// Returns nothing if the array is empty?
	describe('add', function() {
		it('Grabs metadata and adds the song to the db', function(done) {
			var videoId = 'YolcxelpLtU';

			var _success = true;
			var _video = {
				title: 'Classixx - I\'ll Get You (Treasure Fingers Remix) [HD]',
				thumbnail: 'https://i.ytimg.com/vi/YolcxelpLtU/default.jpg',
				duration: '6:05'
			};

			var _youtubeResponse = {
				items: [
					{
						snippet: {
							title: 'Classixx - I\'ll Get You (Treasure Fingers Remix) [HD]',
							thumbnails: {
								default: {
									url: 'https://i.ytimg.com/vi/YolcxelpLtU/default.jpg',
									width: 120,
									height: 90
								}
							}
						},
						contentDetails: {
							duration: 'PT6M5S'
						}
					}
				]
			}
			listStub.yields(null, _youtubeResponse);

			Song.add(videoId, function(err, metadata) {
				assert.equal(err, null);
				assert.deepEqual(metadata, _video);
				// Refactor to song.get()
				db.get().hgetall('song:' + videoId, function(err, data) {
					assert.equal(data.title, _video.title);
					assert.equal(data.thumbnail, _video.thumbnail);
					assert.equal(data.duration, _video.duration);
					done();
				});
			});
		});
	});
	describe('addList', function() {
		it('returns a list of songs for a valid playlist', function(done) {
				done();
		})
	});
	describe('fetchMetadata', function() {
		it('Gets metadata from youtube for a valid video ID', function(done) {
			var videoId = 'YolcxelpLtU';

			var _youtubeResponse = {
				items: [
					{
						snippet: {
							title: 'Classixx - I\'ll Get You (Treasure Fingers Remix) [HD]',
							thumbnails: {
								default: {
									url: 'https://i.ytimg.com/vi/YolcxelpLtU/default.jpg',
      						width: 120,
      						height: 90
								}
							}
						},
						contentDetails: {
							duration: 'PT6M5S'
						}
					}
				]
			}
			listStub.yields(null, _youtubeResponse);

			var _video = {
				title: 'Classixx - I\'ll Get You (Treasure Fingers Remix) [HD]',
				thumbnail: 'https://i.ytimg.com/vi/YolcxelpLtU/default.jpg',
				duration: '6:05'
			};

			Song.fetchMetadata(videoId, function(err, video) {
				assert.equal(err, null);
				assert.equal(video.videoId, _video.videoId);
				assert.equal(video.title, _video.title);
				assert.equal(video.thumbnail, _video.thumbnail);
				assert.equal(video.duration, _video.duration);
				done();
			});
		});
	});
	afterEach(function() {
		sandbox.restore();
	});
});
