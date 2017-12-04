/* playlist.js - A list of music that viewers can add to
		state() - Gets the currently playing song and playlist
		get() - Gets the ordered list of songs
		nowPlaying() - Gets the currently selected song
		play(song) - Selects a specific song
		add(song)	- Adds a song to the list
		delete(song) - Removes a song from the list
		skip() - Skips the currently selected song

		Data model:
			Playlist:
				lpush playlist 'WqPnZ4I9IdU'
			Current:
				hget current videoId 'WqPnZ4I9IdU'
				// hget current timestamp '0m32s' (for syncing across network)
*/


var db;

var start = function (_db) {
	// Creates the playlist module

	db = _db;
};

var get = function(callback) {
	// Get a list of songs
	// Input: (none)
	// Output: error, [songs]

	db.get().lrange('playlist', 0, -1, function(err, songs) {
		callback(err, songs);
	});
};

var add = function(song, callback) {
	// Add a song to end of the playlist
	// Input: song
	// Output: error, success

	if(song) {
  	song = validateInput(song);

		// Check if song is already in the playlist
		get(function(err, playlist) {
			if(!playlist.includes(song)) {
				// push song onto list
				db.get().rpush('playlist', song, function(err, success) {
					if(!err) {
						// Successfully added the song
						callback(null, true);
					}	else {
						callback(err, null);
					}
				});
			}	else {
				// Song already exists in Playlist
				callback('Song already exists', null);
			}
		});
	}
	else {
		callback('no song specified', null);
	}
};

var play = function(song, callback) {
	// Play a song currently in the playlist
	// Input: song
	// Output: error, success

	if(song) {
		db.get().hset('current', 'song', song, function(err, success) {
			callback(err, success);
		});
	} else {
		callback('no song specified', null);
	}
}

var state = function(callback) {
	// Gets the playlist and current data
	// Input: (none)
	// Output: error, {state}

	var state = {};

	get(function(err, songs) {
		if(!err) {
			state.songs = songs;
			db.get().hget('current', 'song', function(err, data) {
				if(!err) {
					state.videoId = data;
					callback(null, state);
				}
			})
		}
	});
}

var remove = function(song, callback) {
	// Removes a song from the playlist
	// Input: song
	// Output: error, success

	if(song) {
		db.get().lrem('playlist', 1, song, function(err, success) {
			callback(err, success);
		});
	} else {
		callback('no song specified');
	}
}
// skip
var skip = function(callback) {
	// Skip the currently playing song
	// Input: (none)
	// Output: error, success

	// Get the currently playing track and playlist
	state(function(err, state) {
		// Determine position in the list
		let current = state.videoId;
		let songs = state.songs;

		let index = songs.indexOf(current);

		let nextvideo;

		if (index >= 0 && index < songs.length - 1) {
			// We're somewhere besides the end of the list
			nextVideo = songs[index + 1];
		} else {
			// We're at the end of the list
			nextVideo = songs[0];
		}

		play(nextVideo, function(err, success) {
			if(!err) {
				callback(null, true);
			}
		});
	});
}

var validateInput = function(song) {
	const ytString = 'https://www.youtube.com/watch?v=';

	// Parse
	if(song.indexOf(ytString) == 0) {
		song = song.slice(ytString.length);
	}

	return(song);
}

module.exports = {
	start: start,
	add: add,
	remove: remove,
	get: get,
	play: play,
	state: state,
	skip: skip,
	validateInput: validateInput
};
