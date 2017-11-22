var socket = io();

	var snitch;
	var Gryffindor;
	var Hufflepuff;
	var Ravenclaw;
	var Slytherin;
	var Countdown;
	var collision = 0;
	var imgPath = './quidditch/images/';
	var cntdnImg;
	var countdownNumber = 3;
	var active = false;	// A game is currently being played, don't start another!
	var timers = [];

	socket.on('show:overlay', function(template) {
		if(template.name == 'quidditch') {
			startGame();
		}
	});

	function startGame() {
		if(!active) {
			active = true;
			snitch = new component(30, 30, './quidditch/images/snitch.png', 625, 348, 'image', 'snitch');
			Gryffindor = new component(70, 45, './quidditch/images/Gryffindor.png', 2, 2, 'image', 'Gryffindor');
			Hufflepuff = new component(70, 45, './quidditch/images/Hufflepuff_rev.png', 1203, 2, 'image', 'Hufflepuff');
			Ravenclaw = new component(70, 45, './quidditch/images/Ravenclaw.png', 2, 643, 'image', 'Ravenclaw');
			Slytherin = new component(70, 45, './quidditch/images/Slytherin_rev.png', 1203, 643, 'image', 'Slytherin');
		  Countdown = [new component(143, 260, '', 565, 210, 'image', 'Countdown0'),
			new component(143, 260, './quidditch/images/1.png', 565, 210, 'image', 'Countdown1'),
			new component(143, 260, './quidditch/images/2.png', 565, 210, 'image', 'Countdown2'),
			new component(143, 260, './quidditch/images/3.png', 565, 210, 'image', 'Countdown3')];
			myGameArea.intro();
		}
	}

	var music = new Audio('./quidditch/audio/Quidditchmidi130.wav');

	var myGameArea = {
	    canvas : document.createElement('canvas'),
	    intro: function() {
				this.canvas.style.display = 'block';
	      this.canvas.width = 1280;
	      this.canvas.height = 720;
	      this.context = this.canvas.getContext('2d');
	      document.body.insertBefore(this.canvas, document.body.childNodes[0]);
	      this.frameNo = 0;
	      this.interval = setInterval(countdown, 1000);
	    },
	    start : function() {
	      clearInterval(this.interval);
	        music.play();

					// Start everything movin'
					// TODO - Refactor this into the main game loop
					timers.push(setInterval(function() {randplayermove(snitch)}, 350));
				  timers.push(setInterval(function() {randplayermove(Gryffindor)}, 1000));
				  timers.push(setInterval(function() {randplayermove(Hufflepuff)}, 1000));
				  timers.push(setInterval(function() {randplayermove(Ravenclaw)}, 1000));
				  timers.push(setInterval(function() {randplayermove(Slytherin)}, 1000));

					this.interval = setInterval(updateGameArea, 20);
	      },
	    clear : function() {
	        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	    },
	    stop : function(winner) {
					active = false;

					// Stop timer/game loop
	        clearInterval(this.interval);
					timers.forEach(function(timer) {
						clearInterval(timer);
					});

					// Reset the countdown
					countdownNumber = 3;

					// Stop the music
					music.pause();
					music.currentTime = 0;

					this.canvas.style.display = 'none';

					socket.emit('quidditch:winner', winner);
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
	        var winner = this.name;
	        // winAnnounce += " is the Winner!";
	        // alert(winAnnounce);
	        myGameArea.stop(winner);
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

	function countdown(){
	  if(countdownNumber == 0) {
	    myGameArea.start();
		}
	  else {
			myGameArea.clear();

			Countdown[countdownNumber].update();
			countdownNumber--;

	    Gryffindor.speedX=0; Gryffindor.speedY=0;
	    Gryffindor.update();
	    Hufflepuff.speedX=0; Hufflepuff.speedY=0;
	    Hufflepuff.update();
	    Ravenclaw.speedX=0; Ravenclaw.speedY=0;
	    Ravenclaw.update();
	    Slytherin.speedX=0; Slytherin.speedY=0;
	    Slytherin.update();
	  }
	}

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
