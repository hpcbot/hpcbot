/* Config File for tmi.js containing twitch info */

// HPC_USERNAME - Your Twitch Username that has access to the channel
// Example: bdickason
var HPC_USERNAME = process.env.HPC_USERNAME;

if(!HPC_USERNAME) {
	console.log("ERROR: HPC_USERNAME is not set in your .env file");
	console.log("Please add your Twitch username to .env in the root directory of your project");
	process.exit(1);
}

// HPC_PASSWORD - Your Twitch oauth hash 
// To generate an OAuth hash, visit: http://twitchapps.com/tmi/
// Example: oauth:1923094jalfjioa918fads
var HPC_PASSWORD = process.env.HPC_PASSWORD;

if(!HPC_PASSWORD) {
	console.log("ERROR: HPC_PASSWORD is not set in your .env file");
	console.log("Please add your oauth password to .env in the root directory of your project");
	console.log("Make sure you generate an OAuth hash via http://twitchapps.com/tmi/ instead of a plaintext password");
	process.exit(1);
}
if(!HPC_PASSWORD.startsWith('oauth')) {
	// Make sure this is a valid oauth token
	console.log("ERROR: HPC_PASSWORD did not begin with 'oauth'");
	console.log("Make sure you generate an OAuth hash via http://twitchapps.com/tmi/ instead of a plaintext password");
	process.exit(1);
}


var HPC_CHANNEL = process.env.HPC_CHANNEL;
if(!HPC_CHANNEL) {
	console.log("ERROR: HPC_CHANNEL is not set in your .env file");
	console.log("Please add the chat channel to .env in the root directory of your project");
	process.exit(1);
}

exports.options = {}