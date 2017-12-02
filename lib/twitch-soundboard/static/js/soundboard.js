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

	$('#addg5').click(function() {
		socket.emit('add g 5');
	});

	$('#addg10').click(function() {
		socket.emit('add g 10');
	});

	$('#subg5').click(function() {
		socket.emit('sub g 5');
	});

	$('#subg10').click(function() {
		socket.emit('sub g 10');
	});

	$('#addh5').click(function() {
		socket.emit('add h 5');
	});

	$('#addh10').click(function() {
		socket.emit('add h 10');
	});

	$('#subh5').click(function() {
		socket.emit('sub h 5');
	});

	$('#subh10').click(function() {
		socket.emit('sub h 10');
	});

	$('#addr5').click(function() {
		socket.emit('add r 5');
	});

	$('#addr10').click(function() {
		socket.emit('add r 10');
	});

	$('#subr5').click(function() {
		socket.emit('sub r 5');
	});

	$('#subr10').click(function() {
		socket.emit('sub r 10');
	});

	$('#adds5').click(function() {
		socket.emit('add s 5');
	});

	$('#adds10').click(function() {
		socket.emit('add s 10');
	});

	$('#subs5').click(function() {
		socket.emit('sub s 5');
	});

	$('#subs10').click(function() {
		socket.emit('sub s 10');
	});

	$('#spook').click(function() {
		socket.emit('spook');
	});

	$('#housetest').click(function() {
		socket.emit('housetest');
	});

	$('#quidditch').click(function() {
		socket.emit('quidditch');
	});

	$('#xmas').click(function() {
		socket.emit('xmas');
	});

});
