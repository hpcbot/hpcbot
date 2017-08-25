/* sounboard.js - Contains basic logic for triggering overlays */

$(document).ready(function() {
	var socket = io();

	// Fades the overlay in/out
	$('#gift').click(function() {
		socket.emit('gift');
	});

	$('#muggle').click(function() {
		socket.emit('muggle');
	});

	$('#sac').click(function() {
		socket.emit('sac');
	});

	$('#powermove').click(function() {
		socket.emit('powermove');
	});

	$('#smoke').click(function() {
		socket.emit('smoke');
	});

	$('#monster').click(function() {
		socket.emit('monster');
	});

	$('#kia').click(function() {
		socket.emit('kia');
	});

	$('#cheese').click(function() {
		socket.emit('cheese');
	});

	$('#hpcwins').click(function() {
		socket.emit('hpcwins');
	});

	$('#tworax').click(function() {
		socket.emit('tworax');
	});

	$('#polo').click(function() {
		socket.emit('polo');
	});

	$('#buyback').click(function() {
		socket.emit('buyback');
	});

	$('#first').click(function() {
		socket.emit('first');
	});

	$('#open').click(function() {
		socket.emit('open');
	});

	$('#close').click(function() {
		socket.emit('close');
	});
});
