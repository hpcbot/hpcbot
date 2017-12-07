/* random.js - Generate random numbers  */

var Chance = require('chance');

var eventbus;
var chance;

var start = function start() {
	// Initialize Chance library
	chance = new Chance();
};

function between(min, max) {
	// Generates a random number between (min) and (max)
	// Currently must be an integer
	var number = chance.integer({min: min, max: max})
	return(number);
}

module.exports = {
	start: start,
	between: between
};
