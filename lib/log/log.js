/* log.js - Send logs to server for easy debugging */

var Events = require('events');
var extend = require('extend');

var winston = require('winston');
winlog = require('winston-loggly-bulk');

// config variables w/ default values
var options = {
    events: new Events.EventEmitter()           // Listens to events
};

var start = function start(_options) {
    // Options for starting the log service
    options = extend(options, _options);    // Copy _options into options, overwriting defaults

    if(options.subdomain && options.token) {
      // Send logs to loggly if configured
      winston.add(winston.transports.Loggly, {
        token: options.token,
        subdomain: options.subdomain,
        tags: ["Winston-NodeJS"],
        json:true
      });
    }

    /* Listen for log events */
    options.events.on('log:info', logInfo);
    options.events.on('log:error', logError);
};

var logInfo = function(event, parameters) {
  winston.log('info', event, parameters);
};

var logError = function(event, parameters) {
  winston.log('warning', event, parameters);
};
module.exports = {
    start: start,
    options: options    // Expose options - useful for testing
};
