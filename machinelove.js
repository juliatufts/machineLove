;(function(){

	// canvas and logic variables
	var canvas = document.getElementById('canvas');
	canvas.addEventListener("click", function(event){
		checkClick(canvas, event);
	});
	var ctx = canvas.getContext('2d');
	var machineOn = false;
	
	// machine
	var machineImage = new Image(4096, 512);
	machineImage.src = "Images/MachineSpriteSheet.png";

	var machine = sprite({
		context: canvas.getContext('2d'),
		width: 512,
		height: 512,
		image: machineImage,

		ticksPerFrame: 5,
		numberOfFrames: 8,
		loop: true,

		startx: 0,
		starty: 0
	});

	// heart
	var heartImage = new Image(16, 16);
	heartImage.src = "Images/Heart.png";

	var heart = sprite({
		context: canvas.getContext('2d'),
		width: 18,
		height: 18,
		image: heartImage,

		ticksPerFrame: 5,
		numberOfFrames: 1,
		loop: false,

		// the spawn point
		startx: 451,
		starty: 475
	});

	// ---------------------------- Main Game Loop ---------------------- //
	window.addEventListener('load', function(){
		heart.yPos = canvas.height;	// adjust the heart's y position to be offscreen to start
  		gameLoop();
	});

	function gameLoop(){
		window.requestAnimationFrame(gameLoop);
		
		if (machineOn) {
			heart.loop = true;
			machine.animate();
		} else {
			heart.loop = false;
			machine.frameIndex = 0; // reset the machine to off state
		}
		heart.render();
		heart.fall();
		machine.render();
	}
	// --------------------------- End Main Game Loop -------------------- //

	// creates and returns a sprite object
	function sprite(options) {
		var spriteObject = {};
		var tickCount = 0;
		var ticksPerFrame = options.ticksPerFrame || 0;
		var numberOfFrames = options.numberOfFrames || 1;

		spriteObject.context = options.context;
		spriteObject.width = options.width;
		spriteObject.height = options.height;
		spriteObject.image = options.image;
		spriteObject.loop = options.loop;
		spriteObject.startx = options.startx;
		spriteObject.starty = options.starty;
		spriteObject.frameIndex = 0;
		spriteObject.yPos = 0;

		spriteObject.render = function() {
			// draw the sprite
			spriteObject.context.drawImage(
				spriteObject.image,
				spriteObject.frameIndex * spriteObject.width,
				0,
				spriteObject.width,
				spriteObject.height,
				spriteObject.startx,
				spriteObject.starty + spriteObject.yPos,
				spriteObject.width,
				spriteObject.height);
		};

		// for still animations (machine)
		spriteObject.animate = function() {
			// if sprite sheets involve transparency, clear the canvas here
			tickCount += 1;

			if (tickCount > ticksPerFrame){
				tickCount = 0;

				// if the current frame index is in range
				if (spriteObject.frameIndex < numberOfFrames - 1) {
					spriteObject.frameIndex += 1;
				} else if (spriteObject.loop) {
					spriteObject.frameIndex = 1;	// the starting index for the 'machine on' animation
				}
			}
		};

		// for falling down (heart)
		spriteObject.fall = function() {
			tickCount += 1;

			if (tickCount > ticksPerFrame){
				tickCount = 0;

				// if the ypos has fallen off the canvas, reset
				if (spriteObject.starty + spriteObject.yPos >= canvas.height) {
					if (spriteObject.loop) spriteObject.yPos = 0;
				} else {
					spriteObject.yPos += 2;
				}
			}
		};

		return spriteObject;
	}

	// Checks if the user has clicked on the machine button
	var checkClick = function(canvas, event){
		var x = event.x - canvas.offsetLeft;
		var y = event.y - canvas.offsetTop;

		// note that this method of finding the mouse pos fails if we scroll down a bit
		if (17 <= x && x <= 40 && 266 <= y && y <= 290) {
			machineOn = !machineOn;
		}
	};
})();