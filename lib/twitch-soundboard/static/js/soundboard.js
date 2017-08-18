/* sounboard.js - Contains basic logic for triggering overlays */

$(document).ready(function() {
	var socket = io();

	// Fades the overlay in/out
	$('#gift').click(function() {
		socket.emit('gift');
	});
});
