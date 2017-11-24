/* command.js - Simple chat parser to listen for commands */

// Input - !rules
// Output - Event: 'command:rules'

/* To add commands:
    var trigger = {
      name: 'gold',                 // What is the !command that you want to listen for?
      type: 'whisper',              // Is this command triggered via chat or whisper?
      whitelist: true,              // (Optional) check permissions against a whitelist of usernames
      event: 'overlay:gold:show'    // (Optional) Fire a custom event (default: 'commands:gold')
    };
    bot.commands.add(trigger); */
var Events = require('events');
var extend = require('extend');

// config variables w/ default values
var options = {
    whitelist: [],                       // List of usernames to whitelist for whisper comamnds
    events: new Events.EventEmitter()    // Listens to events to trigger commands
};

var commands = [];  // List of commands that have been loaded

var start = function start(_options) {
    // Options for starting chat commands
    options = extend(options, _options);    // Copy _options into options, overwriting defaults
};

var add = function(_commands) {
  // Add command(s) to listen to chat.
  // Expects an Object or array of Objects w/ the following structure:
  //    name: 'gold',                 // Command we should listen for (i.e. !gold)
  //    type: 'chat',                 // Where should we listen? (chat, whisper)
  //    whitelist: true,              // (Optional) Check permissions against a whitelist of usernames
  //    event: 'overlay:gold:show'    // (Optional) Fire a custom event (default: 'commands:gold')

  var queue = []; // Commands to be processed

  if(Array.isArray(_commands)) {
    // Process multiple commands
    queue = _commands;
  } else {
    queue.push(_commands);
  }

  // Loop through each command and load it into our commands array
  queue.forEach(function(item) {
    commands.push(item);      // Keep track of all of the commands

    if(!item.name) {
      return new Error();
    }
    if(!item.type) {
      console.log('got here');
      return new Error();
    }
    if(item.event) {
      // User passed a custom event
      options.events.on('chat:' + item.name, function() {
        options.events.emit(item.event) });
    } else {
      options.events.on('chat:' + item.name, function() {
        options.events.emit('command:' + item.name) });
    }
  });
}

var list = function() {
  // Returns the currently loaded commands
  return(commands);
}

var clear = function() {
  commands = [];
}

module.exports = {
    start: start,
    add: add,
    list: list,
    clear: clear,
    options: options    // Expose options - useful for testing
};
