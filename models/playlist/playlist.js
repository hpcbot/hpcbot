/* playlist.js - A list of music that viewers can add to
		state() - Gets the currently playing song and playlist
		get() - Gets the ordered list of songs
		nowPlaying() - Gets the currently selected song
		play(song) - Selects a specific song
		add(song)	- Adds a song to the list
		delete(song) - Removes a song from the list
		next() - nexts the currently selected song

		Data model:
			Playlist:
				lpush playlist 'WqPnZ4I9IdU'
			Current:
				hget current videoId 'WqPnZ4I9IdU'
				// hget current timestamp '0m32s' (for syncing across network)
*/

var db;
var chance;

var start = function (_db, _chance) {
	db = _db;
	chance = _chance;	// Random number generator for shufflin'
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
	// Input: song video ID
	// Output: error, success

	if(song && song.length != 0) {
		// Check if song is already in the playlist
		get(function(err, playlist) {
			if(!playlist.includes(song)) {
				// push song onto list
				db.get().rpush('playlist', song, function(err, success) {
					if(!err) {
						// Successfully added the song
						callback(null, true);
					}	else {
						callback("Error adding song", null);
					}
				});
			}	else {
				// Song already exists in Playlist
				callback('That song already exists', null);
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
		state(function(err, state) {
			// Check if song is currently playing
			if(state.videoId == song) {
				next(function(err, success) {
					db.get().lrem('playlist', 1, song, function(err, success) {
						callback(err, success);
					});
				});
			} else {
				db.get().lrem('playlist', 1, song, function(err, success) {
					callback(err, success);
				});
			}
		});
	} else {
		callback('no song specified');
	}
}

// next
var next = function(callback) {
	// jump to the next song in the list
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

var shuffle = function(callback) {
	// shuffle/randomize the playlist

	// Get current list
	state(function(err, _state) {
		if(!err) {
			// Shuffle list
			var _songs = _state.songs;
			var songs = chance.shuffle(_songs);

			// Randomize video id
			var newCurrent = chance.integer({min: 0, max: songs.length});
			var videoId = songs[newCurrent];

			// Clear existing playlist
			db.get().ltrim('playlist', -1, 0, function(err, success) {
				if(!err) {
					// Insert new list into DB
					db.get().rpush('playlist', songs, function(err, success) {
						if(!err) {
							// Insert new video id into DB
							play(videoId, function(err, success) {
								if(!err) {
									callback(null, success);
								}
							});
						}
					});
				}
			})
		}
	})
}

var reorder = function(start, end, callback) {
	// swap the position of two songs without pausing playback

	get(function(err, songs) {
		var startSong = songs[start];
		var endSong = songs[end];

		db.get().lset('playlist', end, startSong, function(err, success) {
			if(!err) {
				db.get().lset('playlist', start, endSong, function(err, success){
					if(!err) {
						callback(null, true);
					}
				})
			}
		})
	})
}

var addAfter = function(song, afterSong, callback) {
	// add a song after another song (for user requests)
	state(function(err, state) {
		if(!err) {
			// Check that song isn't empty
			if(song && song.length != 0) {
				// Check if song already exists in the list
				if(!state.songs.includes(song)) {
					if(!state.songs.includes(afterSong)) {
						// Last request is no longer in the list, add it after the currently playing song
						afterSong = state.videoId;
					}

					db.get().linsert('playlist', 'AFTER', afterSong, song, function(err, success) {
						if(!err) {
							callback(null, success);
						} else {
							callback('Could not add song', null);
						}
					});
				} else {
					callback('Song already exists', null);
				}
			} else {
				callback('Song is empty', null);
			}
		}
	});
}


module.exports = {
	start: start,
	add: add,
	remove: remove,
	get: get,
	play: play,
	state: state,
	next: next,
	shuffle: shuffle,
	reorder: reorder,
	addAfter: addAfter
};
