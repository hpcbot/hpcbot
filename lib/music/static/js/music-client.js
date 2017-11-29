/* music.js - Contains client-side logic for requesting songs and playlists */


$(document).ready(function() {
	var socket = io();
	var timer;	// Timer to poll video for status updates


	/* Wire up UI Events */
	// Play / Pause Button
	var playButton = $('#play');
	playButton.click(playPauseVideo);

	var showPlayButton = function() {
		playButton.text('▶');
	}

	var showPauseButton = function() {
		playButton.text('❚❚');
	}


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

		if(event.data == YT.PlayerState.PLAYING) {
			// Player is playing, update some stuff
			showPauseButton();
			timer = setInterval(updateStatus, 100); // Monitor vidoe for updates (percent done etc)
		} if(event.data == YT.PlayerState.PAUSED || event.data == YT.PlayerState.UNSTARTED) {
			showPlayButton();
			clearInterval(timer);	// Stop monitoring video for updates
		}
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
		if(player.getPlayerState() == YT.PlayerState.PLAYING) {
			player.pauseVideo();
		} else {
			player.playVideo();
		}
	}

	// Update the percentae viewed for a given video
	function updateStatus() {
		// Track title
		$('#title').text(player.getVideoData().title);

		// Current timestamp
		var currentTime = player.getCurrentTime().toString();
		var minutes = Math.round(currentTime/60);

		var seconds = Math.round(currentTime % 60);
		seconds = formatSeconds(seconds);

		$('#time').text(minutes + ':' + seconds);

		// Track Progress
		var percentage = Math.round(player.getCurrentTime() / player.getDuration() * 100);
		$('#progress').text(percentage + '%');

	}

	function formatSeconds(seconds) {
		// Fix some weirdness with the youtube timestamp
		if(seconds == 60) {
			// For some reason 60 shows up on the seconds count
			seconds = '00';
		} else if(seconds >= 0 && seconds < 10) {
			// Prepend zero
			seconds = 0 + seconds.toString();
		}

		return seconds;
	}
});

/* Create youtube embed - taken from https://developers.google.com/youtube/iframe_api_reference */
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
