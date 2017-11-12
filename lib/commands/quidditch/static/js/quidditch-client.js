

var snitch;
var Gryffindor;
var Hufflepuff;
var Ravenclaw;
var Slytherin;
var Countdown;
var collision = 0;
var imgPath = './static/images/';
var cntdnImg;
var countdownNumber = 3;

function startGame() {
	snitch = new component(30, 30, './static/images/snitch.png', 625, 348, 'image', 'snitch');
	Gryffindor = new component(70, 45, './static/images/Gryffindor.png', 2, 2, 'image', 'Gryffindor');
	Hufflepuff = new component(70, 45, './static/images/Hufflepuff_rev.png', 1203, 2, 'image', 'Hufflepuff');
	Ravenclaw = new component(70, 45, './static/images/Ravenclaw.png', 2, 643, 'image', 'Ravenclaw');
	Slytherin = new component(70, 45, './static/images/Slytherin_rev.png', 1203, 643, 'image', 'Slytherin');
  Countdown = new component(143, 260, './static/images/3.png', 565, 210, 'image', 'Countdown');
	myGameArea.intro();
}

var music = new Audio('./static/audio/Quidditchmidi130.wav');

var myGameArea = {
    canvas : document.createElement('canvas'),
    intro: function() {
      this.canvas.width = 1280;
      this.canvas.height = 720;
      this.context = this.canvas.getContext('2d');
      document.body.insertBefore(this.canvas, document.body.childNodes[0]);
      this.frameNo = 0;
      this.interval = setInterval(countdown, 500);
      this.interval = setInterval(decrement, 1000);
    },
    start : function() {
      clearInterval(this.interval);
        music.play();
        this.interval = setInterval(updateGameArea, 20);
      },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

function component(width, height, color, x, y, type, name) {
    this.name = name;
    this.type = type;
    if (type == 'image') {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function() {
        ctx = myGameArea.context;
        if (type == 'image') {
            ctx.drawImage(this.image,
                this.x,
                this.y,
                this.width, this.height);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        if (this.x>=1250){
		        this.x = 1250;
		        this.speedX = -1;
	      }
	      else {
		        this.x += this.speedX;
        }

	      if (this.x<=1){
		        this.x = 1;
		        this.speedX = 1;
	      }
	      else {
		        this.x += this.speedX;
	      }

	      if (this.y<=1){
		        this.y = 1;
		        this.speedY = 1;
	      }
	      else {
		        this.y += this.speedY;
	      }

	      if (this.y>=690){
		        this.y = 690;
		        this.speedY = -1;
	      }
	      else {
		        this.y += this.speedY;
	      }
    }
    this.collisionCheck = function(){
      if ((((this.y + this.height - 15) < snitch.y)) ||
            ((this.y+5) > (snitch.y + snitch.height - 5)) ||
            ((this.x + this.width -15) < snitch.x) ||
            (this.x+20 > (snitch.x + snitch.width))) {
        collision = 0;
      }
      else {
        collision = 1;
        music.pause();
        var winAnnounce = this.name;
        winAnnounce += " is the Winner!";
        alert(winAnnounce);
        location.reload();
        }
    }
}

function randplayermove(player) {
  randIntPX = Math.round(Math.random()) * 2 - 1;
	randIntPY = Math.round(Math.random()) * 2 - 1;
	player.speedX += randIntPX;
  player.speedY += randIntPY;
  var dirImg = imgPath + player.name;
  function fwdRev(){
    if (player.speedX >=0){
      dirImg += '.png';
      }
    else {
      dirImg += '_rev.png';
      }
    return dirImg;
  }
  player.image.src = fwdRev();
}

function decrement(){
  countdownNumber--;
}

function countdown(){
  if(countdownNumber == 0) {
    myGameArea.start();
}
  else {
    Countdown.image.src = imgPath + countdownNumber + '.png';
    myGameArea.clear();
    snitch.speedX=0; snitch.speedY=0;
    snitch.update();
    Gryffindor.speedX=0; Gryffindor.speedY=0;
    Gryffindor.update();
    Hufflepuff.speedX=0; Hufflepuff.speedY=0;
    Hufflepuff.update();
    Ravenclaw.speedX=0; Ravenclaw.speedY=0;
    Ravenclaw.update();
    Slytherin.speedX=0; Slytherin.speedY=0;
    Slytherin.update();
    Countdown.update();
    }
}

setInterval(function() {randplayermove(snitch)}, 500);
setInterval(function() {randplayermove(Gryffindor)}, 1000);
setInterval(function() {randplayermove(Hufflepuff)}, 1000);
setInterval(function() {randplayermove(Ravenclaw)}, 1000);
setInterval(function() {randplayermove(Slytherin)}, 1000);
function updateGameArea() {
  myGameArea.clear();
  snitch.newPos();
  snitch.update();
  Gryffindor.newPos();
  Gryffindor.update();
  Gryffindor.collisionCheck();
  Hufflepuff.newPos();
  Hufflepuff.update();
  Hufflepuff.collisionCheck();
  Ravenclaw.newPos();
  Ravenclaw.update();
  Ravenclaw.collisionCheck();
  Slytherin.newPos();
  Slytherin.update();
  Slytherin.collisionCheck();
}

</script>
</body>
</html>
