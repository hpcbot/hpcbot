# hpc-bot
Twitch bot for the Harry Potter Clan

## Installation

1. Download NodeJS: https://nodejs.org/en/
1. Install packages: `npm install`
1. Run the bot: `node app.js`

## Config
Create a file in your root project directory named `.env` *(this file will be automagically .gitignore'd)*

Set the following environment variables:
````
HPC_USERNAME
HPC_PASSWORD
HPC_CHANNEL
````

## Running the App

To run the app, execute `npm start` from your project root.


## Running Tests

You can run tests to verify that everything is working with the command `npm test`. This requires **mocha** to be installed with `npm install -g mocha`.

If you plan to submit pull requests, please ensure that the request includes proper test coverage of your feature.


## Commands
`!sortinghat test` - Testing sorting hat functionality

