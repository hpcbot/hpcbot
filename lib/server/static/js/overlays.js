/* overlays.js - Contains basic logic for overlays */

$(document).ready(function() {
	// Initialize event listeners
	var socket = io();

	socket.on('overlay:house', function triggerOverlay(payload) {
		var data = {};
		var delay;	// How long to pause the overlay for

		switch(payload.house) {
			case 'Hufflepuff':
				data = {
		  			house_text: 'Hufflepuff',
			  		house_image: '/images/hufflepuff.png',
			  		house_audio: '/audio/hufflepuff.m4a'
		  		};
		  		delay = 5000;
			break;
			case 'Gryffindor':
				data = {
		  			house_text: 'Gryffindor',
			  		house_image: '/images/gryffindor.png',
			  		house_audio: '/audio/gryffindor.m4a'
		  		};
		  		delay = 8000;
			break;
			case 'Ravenclaw':
				data = {
		  			house_text: 'Ravenclaw',
			  		house_image: '/images/ravenclaw.png',
			  		house_audio: '/audio/ravenclaw.m4a'
		  		};
		  		delay = 7000;
			break;
			case 'Slytherin':
				data = {
		  			house_text: 'Slytherin',
			  		house_image: '/images/slytherin.png',
			  		house_audio: '/audio/slytherin.m4a'
		  		};			
		  		delay = 6500;
			break;
		}

		data.username = payload.username;

		addData('.sortinghat', data);
		showOverlay('.sortinghat', delay);
    	
	});

	var showOverlay = function showOverlay(overlay, delay) {
	  	$(overlay).fadeIn(650, function() {
		    // Animation complete.
		    $(overlay).delay(delay).fadeOut(600);
		});
	};	

	var addData = function addData(overlay, data) {
		$(overlay + ' #username').text(data.username);
		$(overlay + ' #house_text').text(data.house_text);
		
		// Swap out image
		$(overlay + ' #house_logo').attr('src', data.house_image);
		// Load and play house sound
		$(overlay + ' #house_audio').attr('src', data.house_audio);
		$(overlay + ' #player')[0].load();
		$(overlay + ' #player')[0].play();
	};
});