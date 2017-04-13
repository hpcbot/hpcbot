/* overlays.js - Contains basic logic for overlays */

$(document).ready(function() {
	// Initialize event listeners
	console.log( 'ready!' );
	var socket = io();

	socket.on('overlay:house', function (house) {
		var data = {
			user: 'MattQ',
  			house_text: 'Hufflepuff',
	  		house_image: 'http://vignette2.wikia.nocookie.net/harrypotter/images/5/50/0.51_Hufflepuff_Crest_Transparent.png/revision/latest?cb=20161020182518',
	  		house_audio: '/audio/hufflepuff.m4a'
  		};

		addData('.sortinghat', data);
		showOverlay('.sortinghat');
    	
	});
	

	$('#clickme').click(function() {
		var data = {
			user: 'MattQ',
  			house_text: 'Hufflepuff',
	  		house_image: 'http://vignette2.wikia.nocookie.net/harrypotter/images/5/50/0.51_Hufflepuff_Crest_Transparent.png/revision/latest?cb=20161020182518',
	  		house_audio: '/audio/hufflepuff.m4a'
  		};

		addData('.sortinghat', data);
		showOverlay('.sortinghat');

	});

	var showOverlay = function showOverlay(overlay) {
	  	$(overlay).fadeIn(650, function() {
		    // Animation complete.
		    $(overlay).delay(5000).fadeOut(600);
		});
	};	

	var addData = function addData(overlay, data) {
		$(overlay + ' #username').text(data.user);
		$(overlay + ' #house_text').text(data.house_text);
		
		// Load and play house sound
		$(overlay + ' #house_audio').attr('src', data.house_audio);
		$(overlay + ' #player')[0].load();
		$(overlay + ' #player')[0].play();
	};
});