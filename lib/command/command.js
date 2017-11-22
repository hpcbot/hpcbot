/* command.js - Simple chat parser to listen for commands */

// Input - !rules
// Output - Event: 'command:rules'

/* To add commands:
    var trigger = {
      name: 'gold',                // What is the !command that you want to listen for?
      type: 'whisper',            // Is this command triggered via chat or whisper?
      whitelist: true,            // (Optional) check permissions against a whitelist of usernames
      event: 'overlay:gold:show' // (Optional) Fire a custom event (default: 'commands:gold')
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

var add = function(_overlays) {
  // Add command(s) to listen to chat.
  // Expects an Object or array of Objects w/ the following structure:
  //    name: 'gold',                 // Command we should listen for (i.e. !gold)
  //    type: 'chat',                 // (chat, whisper)
  //    whitelist: true,              //
  //    text: 'Blah has subscribed!'  // (optional) Text to display/read
  //    static: '../static/blah'      // (optional) directory containing images, etc to serve via webserver
  //    view:   '../test.pug'         // (optional) pug template to inject instead of the default

  var queue = []; // Overlays to be processed

  if(Array.isArray(_overlays)) {
    // Process multiple overlays
    queue = _overlays;
  } else {
    queue.push(_overlays);
  }

  // Loop through each overlay and load it into our overlays array
  queue.forEach(function(item) {
    var overlay;
    var template;

    switch(item.type) {
      case 'text':
        overlay = new types.text();
        break;
      case 'video':
        // Add trigger event and video file to 'overlays' so we can reference it
        overlay = new types.video(item.name, item.file);
        break;
      case 'html':
        overlay = new types.html(item.name, item.view, item.static);
        break;
    }

    overlays.push(overlay);      // Keep track of all of the overlays
    addRoute(overlay.template);  // Load template and static directory so it has a URL endpoint on the server
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
