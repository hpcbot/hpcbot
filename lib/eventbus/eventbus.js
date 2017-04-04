/* eventbus.js - global events object that can pass around events
	Just a wrapper for EventEmitter
*/

const EventEmitter = require('events');
const emitter = new EventEmitter();

emitter.on('uncaughtException', function (err) {
    console.error(err);
});

module.exports = emitter;