# hpc-bot
A Twitch Bot library to quickly build custom commands, overlays, and other ways to make your stream incredibly interactive.

# Overview

hpc-bot was started because the existing bots out there didn't allow a high amount of customization and logic. We wanted to make html5 games that our viewers could play with us during downtime and add more options than just voting and betting.

We wanted a library that was easy to implement in node and would let us add features regularly to keep our viewers entertained.

**Key Features**
* `chat` Chat bot with interactive chat and whisper commands (e.g. !music)
* `overlays` Trigger custom overlays (video, html, audio, etc) that play on your stream
* `music` Listen to music sync'd with your fellow streamers and take viewer requests
* `resources` Users can earn points and spend them on items/consumables that affect the stream
* `soundboard` Trigger events and overlays from your browser
* `teams` Users can join a team and compete against other teams for challenges
* `utils` A bunch of useful utilities to run your stream: Random numbers, logging/analytics

# Setup

## Installation (Existing Project)

1. Add the package into your project: `npm install hpc-bot`
1. Install Redis (database): http://redis.io

## Installation (New Project)

1. Install NodeJS: http://nodejs.org
1. Create a starter file: `index.js`
1. Add the package to your project: `npm install hpc-bot`
1. Install Redis (database): http://redis.io

## Config

First, you need to create a Twitch account and App for your bot: https://blog.twitch.tv/client-id-required-for-kraken-api-calls-afbb8e95f843

hpc-bot requires a few parameters to be configured up front to work with the database and external services. These parameters are passed in via the `options` object when you start the bot.

Here are the parameters that `options` accepts:
| Parameter    | Required | Example | Description |
| --------     | :------: | ------- | ----------- |
| **username** | yes  | hpc.dumbledore | Your bot's Twitch Username (required) |
| **oauth**    | yes  | oauth:1923094jalfjioa918fads | Your Twitch oauth hash. see: http://twitchapps.com/tmi/ |
| **channel**  | yes  | #harrypotterclan | Your Twitch chat channel |
| **clientID** | yes  | asfdkjkl14jadfa | Your Twitch app Client ID - https://blog.twitch.tv/client-id-required-for-kraken-api-calls-afbb8e95f843 |
| **secret**   | yes  | 1lkjklmasd0c0a  | Your Twitch app Secret - https://blog.twitch.tv/client-id-required-for-kraken-api-calls-afbb8e95f843 |
| **eventbus** | no   | `new EventEmitter()`` | The eventemitter object that the bot uses to call/listen for events |
| **whitelist** | no  | [ 'bdickason', 'larry_manalo' ] | An array of twitch usernames that have access to the web interface and whitelisted commands |
| **youtubeKey** | no | k12jlkjasdjamc | Your Youtube API key to load music videos |
| **hostname** | no | harrypotterclan.com | Necessary for testing/deploying the music feature |
| **logglyToken** | no | akjsdklfjakljf | Your Loggly token if you want to log events for debugging purposes |
| **logglySubdomain** | no | bdickason | Your Loggly subdomain if you want to log events for debugging purposes |
| **mixpanel** | no   | akjflj232jk1a   | Your Mixpanel ID to save analytics |

Phew! Hope you got that all setup right :D There should be errors along the way if something goes wrong to help you debug when you run the app.

## Running the App

To run the app, execute `npm start` from your project root.

# Usage

## chat

## overlays

## music

## resources

## soundboard

## teams

## utils

# Contributing
## Changing what the bot says (Strings)

You can locate all of the strings the bot uses in `config/strings.json`: https://github.com/bdickason/hpc-bot/blob/master/config/strings.json

You can edit the format here there, just make sure you copy/paste the resulting file here to test it: http://jsonlint.com/


## Running Tests

You can run tests to verify that everything is working with the command `npm test`. This requires **mocha** to be installed with `npm install -g mocha`.

If you plan to submit pull requests, please ensure that the request includes proper test coverage of your feature.


## Building the app

Because we use React, our app requires a step to build your client side changes into a bundle.js file.

To build for **Development**, use `npm run dev`. This will watch your client side js files and re-build a debug-friendly react bundle whenever you change them.

To build for **Production**, use `npm run build`. This will build a single bundle.js file that is production-ready (and smaller!) but will not watch changes.
