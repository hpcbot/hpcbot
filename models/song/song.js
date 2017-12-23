/* song.js - Metadata about individual song
		get() - Gets metadata for a single song
		list() - Gets metadata for a playlist
		add() - Add/replaces metaata about a specific song

		Data model:
			Current:
				hget song:YolcxelpLtU thumbnail https://i.ytimg.com/vi/YolcxelpLtU/default.jpg
				// hget current duration '0m32s' (for syncing across network)
*/

var extend = require('extend');

/* Pull Youtube metadata */
var iso8601 = require('iso8601-duration');  // Youtube returns duration in a funky format

var youtube;		// Object to reference youtube api

var db;

let options = {
	youtube: null,		// Function we use to access the youtube API
	youtubeKey: null	// Required to authenticate via youtube. Get one at https://developers.google.com
};

var start = function (_db, _options) {
	// Options for pulling song metadata
	options = extend(options, _options);    // Copy _options into options, overwriting defaults

	youtube = options.youtube;

	db = _db;
};

var get = function(videoId, callback) {
	// Get metadata for a specific song
	// Input: videoId
	// Output: error, {metadata}

	db.get().hgetall('song:' + videoId, function(err, video) {
		if(Object.keys(video).length == 0) {
			callback('Song does not exist', null);
		} else {
			callback(err, video);
		}
	});
};

// HACK - This might be really, really slow. Need to find a better/faster way.

var getList = function(videoIds, callback) {
	// Get metadata for a bunch of songs
	// Input: [videoIds]
	// Output: error, [{metadata}]

	var songs = [];

	if(videoIds) {
		videoIds.forEach(function(videoId) {
			db.get().hgetall('song:' + videoId, function(err, video) {
				if(!err) {
					songs.push(video);

					if(songs.length == videoIds.length) {
						// Ugly hack to end the loop - hope it's not slow :x
						callback(null, songs);
					}
				} else {

						console.log(err);
						callback("Error retrieving song", null);
				}
			});
		});
	}
};

var add = function(videoId, callback) {
	// Grab and store metadata for a particular song
	// Input: videoId
	// Output: error, success

	if(videoId) {
		// Check if song is already in the playlist
		// get(function(err, playlist) {
			// if(!playlist.includes(song)) {
				// Grab metadata from youtube
				fetchMetadata(videoId, function(err, video) {
					if(!err) {
						//  Save song metadata
						db.get().hmset('song:' + videoId, video, function(err, success) {
							if(!err) {
								// Successfully added the song
								callback(null, video);
							}	else {
								console.log(err);
								callback("Error adding song", null);
							}
						});
					} else {
						console.log(err);
						callback("Error adding song", null);
					}
				});
			// }	else {
				// Song already exists in Playlist
				// callback('Song already exists', null);
			// }
	}
	else {
		callback('no song specified', null);
	}
};

var addList = function(listId, callback) {
		// Add a playlist to the end of the playlist
		// Input: youtube playlist ID
		// Output: error, title, [song IDs]

		let list = [];

		if(listId) {
			// Grab list details from youtube
			youtube.playlistItems.list({
				maxResults: 25,
				auth: options.youtubeKey,
				playlistId: listId,
				part: 'snippet, contentDetails'
			}, function(err, response) {
				// Parse response
				if(!err) {
					response.items.forEach(function(item) {
						let video = parseMetadata(item.snippet, item.contentDetails);

						db.get().hmset('song:' + item.contentDetails.videoId, video, function(err, success) {

							list.push(item.contentDetails.videoId);

							if(list.length == response.items.length) {
								// Last item added, callback!
								callback(null, list);
							}
						});
				});
			} else {
				console.log(err);
				callback(err, null);
			}
		});
	}
}

var fetchMetadata = function(videoId, callback) {
	// Fetch song data from the Youtube data API so we can grab thumbnail, duration, etc
	// Input: videoId
	// Output: err, metadata (object)
	/* Initialize youtube API so we can pull down song metadata before loading a player */

	youtube.videos.list({
		auth: options.youtubeKey,
		id: videoId,
		part: 'snippet, contentDetails'
	}, function(err, response) {
		if(!err) {
			let snippet = response.items[0].snippet;
			let details = response.items[0].contentDetails;

			// Parse api output and construct video object
			let video = parseMetadata(snippet, details);

			callback(null, video);

			// Send confirmation message to chat
		} else {
			console.log(err);
			callback("Error retrieving song details", null);

		}
	});
}

var parseMetadata = function(snippet, details) {
	// Parse api output and construct video object
	let video = {};
	video.title = snippet.title;
	video.thumbnail = snippet.thumbnails.default.url;

	if(details.duration) {
		// playlist items don't return a duration

		let duration = iso8601.parse(details.duration)
		video.duration = '';

		if(duration.hours) {
			video.duration += duration.hours + ':';
		}
		if(duration.minutes) {
			video.duration += duration.minutes + ':';
		}
		if(duration.seconds) {
			if(duration.seconds < 10) {
				video.duration += '0';
			}
			video.duration += duration.seconds;
		}
	}

	return(video);
}

module.exports = {
	start: start,
	add: add,
	addList: addList,
	get: get,
	getList: getList,
	fetchMetadata: fetchMetadata
};
