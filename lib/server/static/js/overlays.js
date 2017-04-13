/* overlays.js - Contains basic logic for overlays */

$(document).ready(function() {
	// Initialize event listeners
	console.log( 'ready!' );
	// fadeInOverlay('.sortinghat');



	$('#clickme').click(function() {
		showOverlay('.sortinghat');
	});

	var showOverlay = function showOverlay(name) {
	  	$(name).animate({
		    opacity: 'toggle'
		}, 650, function() {
		    // Animation complete.
		});
	};	
});