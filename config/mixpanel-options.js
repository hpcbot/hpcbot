/* Config File for tmi.js containing twitch info */

// HPC_USERNAME - Your Twitch Username that has access to the channel
// Example: bdickason
var MIXPANEL = process.env.MIXPANEL;

if(!MIXPANEL) {
	console.log("Warning: MIXPANEL is not set in your .env file");
	console.log("Please add your mixpanel key if you want to log events and errors");
}

exports.options = MIXPANEL;