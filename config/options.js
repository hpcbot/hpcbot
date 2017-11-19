/* options.js - Validate and return a properly formatted options module to pass into twitch */

function validate(options) {
  // options.username - Your Twitch Username that has access to the channel
  // Example: bdickason

  if(!options.username) {
  	console.log("ERROR: No username supplied.");
  	console.log("Please pass in your Twitch username via the options object");
  	process.exit(1);
  }

  // oauth - Your Twitch oauth hash
  // To generate an OAuth hash, visit: http://twitchapps.com/tmi/
  // Example: oauth:1923094jalfjioa918fads
  if(!options.oauth) {
  	console.log("ERROR: Oauth token not set");
  	console.log("Please pass in your Twitch OAuth token.");
  	console.log("Make sure you generate an OAuth hash via http://twitchapps.com/tmi/ instead of a plaintext password");
  	process.exit(1);
  }
  if(!options.oauth.startsWith('oauth')) {
  	// Make sure this is a valid oauth token
  	console.log("ERROR: HPC_OAUTH did not begin with 'oauth'");
  	console.log("Make sure you generate an OAuth hash via http://twitchapps.com/tmi/ instead of a plaintext password");
  	process.exit(1);
  }

  // channel - Your Twitch chat channel
  // Example: #harrypotterclan
  if(!options.channel) {
  	console.log("ERROR: No channel supplied.");
  	console.log("Please add the chat channel to .env in the root directory of your project");
  	process.exit(1);
  }

  // clientID - Your Twitch app Client ID - https://blog.twitch.tv/client-id-required-for-kraken-api-calls-afbb8e95f843
  // Example: asfdkjkl14jadfa
  if(!options.clientID) {
  	console.log("ERROR: No Twitch clientID supplied");
  	console.log("Make sure you register a client id for your bot here: https://www.twitch.tv/settings/connections");
  	process.exit(1);
  }

  _options = {
  	identity: {
  		username: options.username,
  		password: options.oauth
  	},
  	channels: [options.channel],
  	clientID: options.clientID
  };

  if(options.mixpanel) {
    // Optional variable
    _options.mixpanel = options.mixpanel;
  }

  if(options.eventbus) {
    // Optional variable
    _options.eventbus = options.eventbus;
  }

  return(_options);
}

module.exports = {validate: validate};
