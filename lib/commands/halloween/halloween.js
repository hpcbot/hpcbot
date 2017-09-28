/* halloween.js - !Commands to start the Halloween Event
*/

var strings = require('../../../config/strings.json');

var eventbus; // Global event bus that modules can pub/sub to
var User;


// Configure Chat triggers so the bot listens for this command
var triggers = [{
	name: 'spook',
	type: 'whisper',
	whitelist: true,
	event: 'spook:show'
}];

var randomint = function randomint (max){
  Random rand = new Random();
  int value = rand.nextInt(max)+1;
}

parameters([2
	// Starts the Halloween Event
  [0] = randomint(max=2)
  [1] = randomint(max=4)
]);

if(parameter.0 == 1 || parameter.0 == 2) {
  switch(house) {
    case '1':
      result = 'add';
      break;
    case '2':
      result = 'sub';
      break;
}};

if(parameter.1 == 1 || parameter.1 == 2 || parameter.1 == 3 || parameter.1 == 4) {
  switch(house) {
    case '1':
      house = 'g';
      break;
    case '2':
      house = 'h';
      break;
    case '3':
      house = 'r';
      break;
    case '4':
      house = 's';
      break;
}};

function Spook(
  play overlay;
  wait 10sec;
  emit result house 5;
)
