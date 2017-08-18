/* housecup.js - !Commands to award and remove points from houses
*/

var strings = require('../../../config/strings.json');

var eventbus; // Global event bus that modules can pub/sub to
var User;

// Configure Chat triggers so the bot listens for this command
var triggers = [{
	name: 'cup',
	type: 'chat',
	event: 'cup:show'
}];

/*
House Cup: !cup

**Whisper**
!d s 5 / 10
!a s 5 / 10

!cup - Shows standings on screen

!winner s
*/

var start = function start(_eventbus, _Team) {
	eventbus = _eventbus;
	Team = _Team;

	eventbus.on(triggers[0].event, showCup);
};

var showCup = function showCup() {
	// Show the team standings in the house cup

	var response = [];

	// Get all current teams' standings in the cup
	Team.getAll (function(err, standings) {
		if(!err && standings) {
			console.log(standings);

			response.push('House Cup Standings:');
			response.push(standings.Gryffindor);
			response.push(standings.Hufflepuff);
			response.push(standings.Ravenclaw);
			response.push(standings.Slytherin);
			// response.push(target + strings.commends.user_has + commends + strings.commends.commends + strings.commends.jealous);
			eventbus.emit('twitch:say', response);
		}
	});
};

module.exports = {
	start: start,
	triggers: triggers
};
