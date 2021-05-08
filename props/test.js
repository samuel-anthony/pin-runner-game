(function(){

	var fps, fpsInterval, startTime, now, then, elapsed,enemyCount = 0,flag = false,isRandom = false,isFinish = true; 
    function init(){
        var canvas = document.getElementsByTagName('canvas')[0];
		var c = canvas.getContext('2d');
		
		var background,background2 = "";
		
		var opening = document.getElementsByTagName('video')[0];
		var win = document.getElementsByTagName('video')[1];
		var loop = document.getElementsByTagName('video')[2];
		
		
		var bgm = document.getElementById("myAudio");
		bgm.loop = true;
		c.canvas.width  = 600;
	    c.canvas.height = 300;
		var mainChar = new Character(canvas.width,canvas.height);
		createImageBitmap(
			document.getElementsByTagName('img')[0], 
			{ resizeWidth: canvas.width, resizeHeight: canvas.height, resizeQuality: 'high' }
		)
		.then(imageBitmap => 
			background = imageBitmap
		);
		createImageBitmap(
			document.getElementsByTagName('img')[1], 
			{ resizeWidth: canvas.width, resizeHeight: canvas.height, resizeQuality: 'high' }
		)
		.then(imageBitmap => 
			background2 = imageBitmap
		);
		var enemy = new Enemies(canvas.width,canvas.height,false,116);
        //var img = document.getElementsByTagName('img')[0];
        var velocity = 200; //200pixels/second
        var velocity2 = 300;
        var distance =0;
        var distance2 =0;
        var lastFrameRepaintTime =0;
        var lastFrameRepaintTime2 =0;

        function calcOffset(time){
            var frameGapTime = time - lastFrameRepaintTime;
            lastFrameRepaintTime = time;
            var translateX = velocity*(frameGapTime/1000);
            return translateX;
        }
        function calcOffset2(time){
            var frameGapTime = time - lastFrameRepaintTime2;
            lastFrameRepaintTime2 = time;
            var translateX = velocity2*(frameGapTime/1000);
            return translateX;
        }
		
		function playVideo(){
			c.drawImage(opening, 0, 0, canvas.width, canvas.height);
            if(opening.ended){
				requestAnimationFrame(draw);
				bgm.play();
			}
			else
			requestAnimationFrame(playVideo);
		}
		
		
		function playLoopVideo(){
			c.drawImage(loop, 0, 0, canvas.width, canvas.height);
            if(loop.ended){
				bgm.play();
				requestAnimationFrame(draw);
			}
			else
			requestAnimationFrame(playLoopVideo);
		}
		
		function playWinVideo(){
			c.drawImage(win, 0, 0, canvas.width, canvas.height);
            if(!win.ended)
				requestAnimationFrame(playWinVideo);
			else{
				c.fillStyle = "#f6ca40";
				c.fillRect(0, 0, c.canvas.width, c.canvas.height);	
				c.textAlign = "center";
				c.font = "20px Verdana";
				var gradient = c.createLinearGradient(0, 0, c.canvas.width, 0);
				gradient.addColorStop("0", "black");
				c.fillStyle = gradient;
				c.fillText("Congrats for finishing your OJK", canvas.width/2, canvas.height/2);
				c.fillText("Made by Sam and Feli", canvas.width/2, canvas.height/2 + 30);
			}
		}
		
        function draw(time){
			now = Date.now(); 
			elapsed = now - then;
			if(elapsed > fpsInterval){
				then = now - (elapsed % fpsInterval); 
				distance += calcOffset(time);
				distance2 +=calcOffset2(time);
				if(distance > background.width){distance =0;}
				if(distance2 > background2.width){distance2 =0;}
				c.clearRect(0,0,canvas.width,canvas.height);
				c.save();
				c.translate(-distance,0);
				c.drawImage(background,0,0);
				c.drawImage(background,background.width,0);
				
				
				c.translate(distance,0);
				if(mainChar.state == 0){
					c.drawImage(mainChar.run[mainChar.run_counter%mainChar.run.length],-c.canvas.width/7,0);
					mainChar.add_run_counter();
				}
				else if (mainChar.state == 1){
					c.drawImage(mainChar.jump[mainChar.jump.length-mainChar.jump_counter],-c.canvas.width/7,0);
					mainChar.decrease_jump_counter();
				}
				
				c.translate(-1.5*distance,0);
				if(enemyCount > 1){		
					if(enemy.enemy_type == 0){
						c.drawImage(enemy.walk[enemy.counter%enemy.walk.length],enemy.charPosition[1],canvas.height/1.3-canvas.height/9);
					}
					else if(enemy.enemy_type == 1){
						c.drawImage(enemy.walk2[enemy.counter%enemy.walk2.length],enemy.charPosition[1],canvas.height/1.3-canvas.height/9);
					}
					
					else if(enemy.enemy_type == 2){
						c.drawImage(enemy.fly[enemy.counter%enemy.fly.length],enemy.charPosition[1],canvas.height/5);
					}
					
					else if(enemy.enemy_type == 3){
						c.drawImage(enemy.fly2[enemy.counter%enemy.fly2.length],enemy.charPosition[1],canvas.height/5);
					}
					enemy.add_counter();
					if(canvas.width - 1.5*distance >0){
						isRandom = false;
						if(enemy.enemy_type < 2){
							if(enemy.charPosition[1]-1.5*distance+10 < mainChar.charPosition[2]-c.canvas.width/7 && enemy.charPosition[1]-10-1.5*distance+canvas.width/11 > mainChar.charPosition[3]-c.canvas.width/7 && canvas.height/1.3-canvas.height/9 < mainChar.charPosition[1]){
								flag = true;
							}
						}
						else{
							if(enemy.charPosition[1]-1.5*distance+10 < mainChar.charPosition[2]-c.canvas.width/7 && enemy.charPosition[1]-10-1.5*distance+canvas.width/11 > mainChar.charPosition[3]-c.canvas.width/7 && canvas.height/5 > mainChar.charPosition[0]){
								flag = true;
							}
						}
					}
				}
				else{
					isRandom = false;
				}
				c.translate(1.5*distance-distance2,0);
				c.drawImage(background2,0,0);
				c.drawImage(background2,1.5*-background2.width+1,0);
				c.drawImage(background2,background2.width+1,0);
				c.restore();
				
			}
			if(!flag){
				if(distance == 0 && !isRandom){
					enemyCount++;
					enemy.randomize_type();
					isRandom = true;
				}
				if(enemyCount > 11){//win
					bgm.pause();
					requestAnimationFrame(winAnimation);
				}
				else{
					requestAnimationFrame(draw);
				}
			}
			else{//lose
				if(mainChar.jump_counter == 18){
					bgm.pause();
					requestAnimationFrame(loseAnimation);
				}
				else{
					requestAnimationFrame(draw);
				}
			}
			
        }
		function winAnimation(){
			fps = 12;
			fpsInterval = 1000 / fps; 
			now = Date.now(); 
			elapsed = now - then;
			if(elapsed > fpsInterval){
				
				then = now - (elapsed % fpsInterval); 
				
				c.clearRect(0,0,canvas.width,canvas.height);
				c.save();
				c.drawImage(background,-distance,0);
				c.drawImage(background,-distance+background.width,0);
				c.drawImage(mainChar.celebrate[mainChar.ending_counter%mainChar.celebrate.length],0,0);
				mainChar.add_ending_counter();
				
				c.translate(-distance2,0);
				c.drawImage(background2,0,0);
				c.drawImage(background2,1.5*-background2.width+1,0);
				c.drawImage(background2,background2.width+1,0)
				
				c.restore();
			}
			
			if(!(mainChar.ending_counter-2 > mainChar.celebrate.length)){
				requestAnimationFrame(winAnimation);
			}
			else{
				isFinish = true;
				mainChar.ending_counter = 0;
				flag = false;
				fps = 24;
				fpsInterval = 1000 / fps; 
				enemyCount = 0
				requestAnimationFrame(playWinVideo);
				win.play();
			}
		}
		function loseAnimation(){
			fps = 12;
			fpsInterval = 1000 / fps; 
			now = Date.now(); 
			elapsed = now - then;
			if(elapsed > fpsInterval){
				then = now - (elapsed % fpsInterval); 
				c.clearRect(0,0,canvas.width,canvas.height);
				c.save();
				
				c.drawImage(background,-distance,0);
				c.drawImage(background,-distance+background.width,0);
				c.drawImage(mainChar.lose[mainChar.ending_counter%mainChar.lose.length],0,0);
				mainChar.add_ending_counter();
				
				c.translate(-distance2,0);
				c.drawImage(background2,0,0);
				c.drawImage(background2,1.5*-background2.width+1,0);
				c.drawImage(background2,background2.width+1,0);
				c.restore();
				
				flag = false;
				
			}
			if(!(mainChar.ending_counter-2 > mainChar.lose.length)){
				requestAnimationFrame(loseAnimation);
			}
			else{
				mainChar.ending_counter = 0;
				flag = false;
				fps = 24;
				fpsInterval = 1000 / fps; 
				enemyCount = 0
				requestAnimationFrame(playLoopVideo);
				loop.play();
			}
		}
        function start(){
			fps = 24;
			fpsInterval = 1000 / fps; 
			then = Date.now(); 
			startTime = then; 
            lastFrameRepaintTime = window.performance.now();
			c.textAlign = "center";
			c.fillText("press enter to play", canvas.width/2, canvas.height/2);
			
            //requestAnimationFrame(playVideo);
        }

        start();

		window.onkeypress = function(event) {
		  if (event.keyCode == 32) {
			mainChar.state = 1;
		  }else  if (event.keyCode == 13 && isFinish) {
			 isFinish = false;
			 requestAnimationFrame(playVideo);
			 opening.play();
		  }
		  else{
			 console.log("key pressed: "+ event.keyCode);
		  }
		};
    }

//invoke function init once document is fully loaded
    window.addEventListener('load',init,false);
	
	class Character {
	  constructor(canvasWidth,canvasHeight) {
		this.canvas = [canvasWidth,canvasHeight];
		this.run = new Array();
		this.jump = new Array();
		this.lose = new Array();
		this.celebrate = new Array();
		this.run_counter = 0;
		this.jump_counter = 18;
		this.ending_counter = 0;
		this.enemy_type = 0;//0,1 walk;2,3fly
		this.set_image_run(canvasWidth,canvasHeight);
		this.set_image_jump(canvasWidth,canvasHeight);
		this.set_image_disappointed(canvasWidth,canvasHeight);
		this.set_image_celebrate(canvasWidth,canvasHeight);
		this.state = 0;
		this.charPosition = [canvasHeight/2.6,canvasHeight/1.3,canvasWidth/3.3,canvasWidth/4.6];//top,bottom,right
	  }
	  add_run_counter(){
		  this.run_counter++;
	  }
	  add_ending_counter(){
		  this.ending_counter++;
	  }
	  decrease_jump_counter(){
		  if(this.jump_counter > 9){
			  this.charPosition[0]-=this.canvas[1]/30;
			  this.charPosition[1]-=this.canvas[1]/30;
		  }
		  else{
			  this.charPosition[0]+=this.canvas[1]/30;
			  this.charPosition[1]+=this.canvas[1]/30;
		  }
		  this.jump_counter--;
		  if(this.jump_counter == 0){
			  this.state = 0;
			  this.jump_counter = this.jump.length;
		  }
	  }
	  set_image_run(canvasWidth,canvasHeight){
		for (let i = 0; i < 24; i++) {			
			createImageBitmap(
				document.getElementsByTagName('img')[i+2], 
				{ resizeWidth: canvasWidth, resizeHeight: canvasHeight, resizeQuality: 'high' }
			)
			.then(imageBitmap => 
				this.run.push(imageBitmap)
			);
		}
	  }
	  set_image_jump(canvasWidth,canvasHeight){
		for (let i = 0; i < 18; i++) {			
			createImageBitmap(
				document.getElementsByTagName('img')[i+26], 
				{ resizeWidth: canvasWidth, resizeHeight: canvasHeight, resizeQuality: 'high' }
			)
			.then(imageBitmap => 
				this.jump.push(imageBitmap)
			);
		}
	  }
	  set_image_disappointed(canvasWidth,canvasHeight){
		for (let i = 0; i < 24; i++) {			
			createImageBitmap(
				document.getElementsByTagName('img')[i+44], 
				{ resizeWidth: canvasWidth, resizeHeight: canvasHeight, resizeQuality: 'high' }
			)
			.then(imageBitmap => 
				this.lose.push(imageBitmap)
			);
		}
	  }
	  set_image_celebrate(canvasWidth,canvasHeight){
		for (let i = 0; i < 24; i++) {			
			createImageBitmap(
				document.getElementsByTagName('img')[i+92], 
				{ resizeWidth: canvasWidth, resizeHeight: canvasHeight, resizeQuality: 'high' }
			)
			.then(imageBitmap => 
				this.celebrate.push(imageBitmap)
			);
		}
	  }
	}
	
	class Enemies{
		constructor(canvasWidth,canvasHeight,is_flying,startingIndex) {
			this.charPosition = [0,canvasWidth];//bottom,left
			this.fly = new Array();
			this.fly2 = new Array();
			this.walk = new Array();
			this.walk2 = new Array();
			this.counter = 0;
			this.set_image_walk(canvasWidth/11,canvasHeight/8,startingIndex);
			this.set_image_walk2(canvasWidth/11,canvasHeight/8,startingIndex+8);
			this.set_image_fly(canvasWidth/11,canvasHeight/8,startingIndex+16);
			this.set_image_fly2(canvasWidth/11,canvasHeight/8,startingIndex+24);
		}
		set_image_walk(canvasWidth,canvasHeight,startingIndex){
			for (let i = 0; i < 8; i++) {			
				createImageBitmap(
					document.getElementsByTagName('img')[i+startingIndex], 
					{ resizeWidth: canvasWidth, resizeHeight: canvasHeight, resizeQuality: 'high' }
				)
					.then(imageBitmap => 
						this.walk.push(imageBitmap)
				);
			}
		}
		set_image_walk2(canvasWidth,canvasHeight,startingIndex){
			for (let i = 0; i < 8; i++) {			
				createImageBitmap(
					document.getElementsByTagName('img')[i+startingIndex], 
					{ resizeWidth: canvasWidth, resizeHeight: canvasHeight, resizeQuality: 'high' }
				)
					.then(imageBitmap => 
						this.walk2.push(imageBitmap)
				);
			}
		}
		set_image_fly(canvasWidth,canvasHeight,startingIndex){
			for (let i = 0; i < 8; i++) {			
				createImageBitmap(
					document.getElementsByTagName('img')[i+startingIndex], 
					{ resizeWidth: canvasWidth, resizeHeight: canvasHeight, resizeQuality: 'high' }
				)
					.then(imageBitmap => 
						this.fly.push(imageBitmap)
				);
			}
		}set_image_fly2(canvasWidth,canvasHeight,startingIndex){
			for (let i = 0; i < 8; i++) {			
				createImageBitmap(
					document.getElementsByTagName('img')[i+startingIndex], 
					{ resizeWidth: canvasWidth, resizeHeight: canvasHeight, resizeQuality: 'high' }
				)
					.then(imageBitmap => 
						this.fly2.push(imageBitmap)
				);
			}
		}
	    add_counter(){
		    this.counter++;
	    }
		randomize_type(){
			this.enemy_type = Math.floor(Math.random() * 4); 
		}
	}
}()); //self invoking function
