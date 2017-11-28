/* music.js - Contains client-side logic for requesting songs and playlists */


$(document).ready(function() {
	var socket = io();

	/* Create Youtube Player */
	window.onYouTubeIframeAPIReady = function() {
		player = new YT.Player('player', {
			height: '195',
			width: '320',
			videoId: 'A2h2YrfcJ4Y',
			events: {
				'onReady': onPlayerReady,
				'onStateChange': onPlayerStateChange
			},
			playerVars: {
				controls: 0,
				disablekb: 1,
				enablejsapi: 1,
				iv_load_policy: 3,
				modestbranding: 1,
				rel: 0,
				showinfo: 0
			}
		});
	}

	/* Player is ready */
	function onPlayerReady(event) {
		// event.target.playVideo();
		// console.log(player);
	}

	function onPlayerStateChange(event) {
		// Update timestamp
		// Update title
		// if (event.data == YT.PlayerState.PLAYING && !done) {
			// setTimeout(stopVideo, 6000);
		// }
	}

	/* Player utility functions */
	function stopVideo() {
		player.stopVideo();
	}

	function playPauseVideo() {
		if(YT.PlayerState.PLAYING) {
			player.stopVideo();
		} else {
			player.playVideo();
		}
	}
});

/* Create youtube embed - taken from https://developers.google.com/youtube/iframe_api_reference */
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
