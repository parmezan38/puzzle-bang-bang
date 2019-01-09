var Match3 = Match3 || {};

Match3.Cowboy = function(state, x, y, timeOffset, data, gridPos) {
  Phaser.Sprite.call(this, state.game, x, y, data.asset);
  
  this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
  
  this.game = state.game;
  this.state = state;
  this.anchor.setTo(0.5, 1);
  this.name = data.name;
  this.enemyHealth = data.health; 
  this.hitChance = data.hitChance;
  this.damage = data.damage;
  this.maxShots = data.shots;
  this.shots = data.shots;
  this.currentCover = null;
  this.coverDuration = data.coverDuration;
  this.preShootDuration = data.preShootDuration;
  this.postShootDuration = data.postShootDuration;
  this.shootDuration = data.shootDuration;
  
  this.smoothed = false;
  // listen for input
  this.inputEnabled = true;
  this.enableUpdate = true;
  this.input.pixelPerfectClick = false;
  this.events.onInputDown.add(state.shoot, this.state);

  // specificne varijable
  this.isDead = false;
  this.isCovered = false;
  this.setCover(false);
  this.isBehindCover = false;
  this.timeOffset = timeOffset;
  this.time = timeOffset;
  this.isTimePaused = false;
  this.isInPlace = false;
  // Poison Stuff
  this.poisonDamage = 0;
  this.poisonTimes = 0;
  this.poisonTimer;
  this.isPoisoned = false;
  
  this.gridPos = gridPos;
  // animacije
  this.animations.add('shoot', [1, 0], 6, false);
  this.animations.add('miss', [1, 3, 3], 2, false);
  this.animations.add('dead', [4, 6], 3, false);
  this.animations.add('damage', [4, 4], 3, false);
  this.animations.add('run', [7, 8], 12, true);
  this.animations.add('coverUp', [2], 1, true);
  this.animations.add('coverDown', [5], 1, true);
  this.animations.add('idle', [0], 1, true);
  this.currentlyPlayingAnim;
  
  this.startingSide = "left";
  this.targetX = x;
  
  // Odlucivanje s koje strane dolazi
  if (gridPos.x < this.state.CENTER_POINT.x){
    this.startingSide = "left";
  } 
  else if (gridPos.x > this.state.CENTER_POINT.x){
    this.startingSide = "right";
  }
  else {
    let randNum = Math.random();
    if(randNum >= 0.5){
      this.startingSide = "right";
    } else {
      this.startingSide = "left";
    }
  }
  
  // Koja je pocetna pozicija s obzirom na stranu
  
  if(this.startingSide == "left"){
    this.startingX = this.targetX - 300;
    this.scale.x = -1;
  }
  else if (this.startingSide == "right"){
    this.startingX = this.targetX + 300;
    this.scale.x = 1;
  }
  
  this.x = this.startingX;
  
  this.startRun();
};

Match3.Cowboy.prototype = Object.create(Phaser.Sprite.prototype);
Match3.Cowboy.prototype.constructor = Match3.Cowboy;

Match3.Cowboy.prototype.startRun = function(){
  this.isInPlace = false;
  this.x = this.startingX;
  let motion = this.game.add.tween(this);
  
  motion.to({x: this.targetX}, 1200 + (this.timeOffset * 5), Phaser.Easing.Linear.none, false, this.timeOffset * 5);
  
  motion.onComplete.add(function(){
    this.beginActions();
  }, this);
  
  motion.start();
  this.setCover(true);
  this.play('run');
};

Match3.Cowboy.prototype.beginActions = function(){
  this.animations.stop('run');
  this.setCover(false);
  this.isInPlace = true;
  this.scale.x = 1;
  this.fsm = this.stateCovering;
  this.checkIfBehindCover();
};

Match3.Cowboy.prototype.setCover = function(boool){
  if(this.name != 'turtle' && !this.currentCover){
    this.isCovered = boool;
  } 
  else if (this.currentCover && this.name != 'turtle') {
    if(this.currentCover.isDead){
      this.isCovered = false;
    } else {
      this.isCovered = boool;  
    }
  }
  else {
    this.isCovered = true;
  }
};
Match3.Cowboy.prototype.checkIfBehindCover = function(){
  let coverPositionIsSame = false;
  // Go trough all the covers in cover group
  this.state.covers.forEach(function(cover){
    if (this.x === cover.x && this.y === cover.y){
      // if Cover Pos same as Enemy Pos, then true
      coverPositionIsSame = true;
      this.currentCover = cover;
    }
  }, this);
  // Check if coverPositionIsSame
  if(coverPositionIsSame){
    this.isBehindCover = true;
  } else {
    this.isBehindCover = false;
  }
};

Match3.Cowboy.prototype.damageEnemy = function(damage, particle, variation){
  if(!this.isDead){
    this.enemyHealth -= damage;
    this.animations.stop();
    this.animations.play('damage');
    this.shakeEnemy();
    this.switchState(this.statePostShoot);
    if (this.enemyHealth <= 0){
      this.killCowboy();
    }
    if(particle){
      this.particleFx('damageParticle' + variation ,1);
    }
  }
};
Match3.Cowboy.prototype.shakeEnemy = function(){
  let origX = this.x,
      randNum = Math.round(Math.random()) * 2 - 1,
      shakeStart = this.game.add.tween(this);
  shakeStart.to( { x: this.x + (randNum * 7)}, 75, Phaser.Easing.Sinusoidal.InOut);
  shakeStart.onComplete.add(function(){
    let shakeEnd = this.game.add.tween(this);
    shakeEnd.to( { x: origX}, 75, Phaser.Easing.Sinusoidal.InOut);
    shakeEnd.start();
  }, this);
  shakeStart.start();
};


Match3.Cowboy.prototype.electricDamage = function(){
  let shockIn = this.game.add.tween(this);
  shockIn.to({tint: 0x00bdf5}, 150, Phaser.Easing.Linear.None, false);
  shockIn.onComplete.add(function(){
    let shockOut = this.game.add.tween(this);
    shockOut.to({tint: 0xffffff}, 150, Phaser.Easing.Linear.None, false);
    shockOut.start();
  }, this);
  shockIn.start();
};
Match3.Cowboy.prototype.particleFx = function(asset, intensity){
  let emitter = this.game.add.emitter(this.world.x, this.world.y - 24,  100);
  emitter.makeParticles(asset);
  emitter.minParticleSpeed.setTo(-42, -32);
  emitter.maxParticleSpeed.setTo(42, 32);
  emitter.gravity = 150;
  emitter.start(true, 250 * (intensity * 1.7 ), null, 16 * intensity); // (is explosion true/false, life span, frequency of release, how many)
};

Match3.Cowboy.prototype.createPoisonTimer = function(){
  this.tint = 0x47882a;
  this.countdownTimer = this.game.time.create(true);
  this.countdownEvent = this.countdownTimer.loop(2000, this.poisonDamageLoop, this);
  this.countdownTimer.start();
};

Match3.Cowboy.prototype.poisonDamageLoop = function(){
  if(!this.isDead && this.isPoisoned && this.poisonTimes > 0){
    this.tint = 0x47882a;
    this.play('damage');
    let damage = this.poisonDamage / 5;
    this.enemyHealth -= damage;
    if (this.enemyHealth <= 0){
      this.killCowboy();
      this.tint = 0xffffff;
      this.countdownTimer.remove(this.countdownEvent);
    }
    this.poisonTimes--;
  } else {
    this.tint = 0xffffff;
    this.countdownTimer.remove(this.countdownEvent);
  }
};

Match3.Cowboy.prototype.killCowboy = function(){
  let i;
  this.isDead = true;
  this.play('dead');
  this.state.enemiesOnScreen--;
  this.state.addNewWaveIfCan();
  for(i = 0; i < this.state.worldGrid.length; i++) {
    for(j = 0; j < this.state.worldGrid[i].length; j++) {
      if(this.gridPos.x === this.state.worldGrid[i][j].x && this.gridPos.y === this.state.worldGrid[i][j].y){
        this.state.worldGrid[i][j].enemy = 0;
        this.inputEnabled = false;
        this.input.pixelPerfectClick = false;
        this.enableUpdate = false;
      } 
    }
  }
};

// UPDATE
Match3.Cowboy.prototype.update = function(){
  if(!this.isDead && this.isInPlace){
    if(!this.isTimePaused){
      this.time++;
      this.fsm();
    } // isTimePaused end
  } else {
    this.time = 0;
  }// isDead + else end
}; // UPDATE end
Match3.Cowboy.prototype.updatePosition = function(){
  this.x = this.state.worldGrid[this.gridPos.arrayY][this.gridPos.arrayX].x;
  this.y = this.state.worldGrid[this.gridPos.arrayY][this.gridPos.arrayX].y;
}; // updatePosition end

// States
Match3.Cowboy.prototype.switchState = function(newState){
  this.time = 0;
  this.fsm = newState;
};
Match3.Cowboy.prototype.stateCovering = function(){
  if (this.isBehindCover){
    this.setCover(true);
    this.animations.play('coverDown');
  } else {
    this.setCover(false);
    this.animations.play('coverUp');
  }
  if (this.time >= this.coverDuration * this.game.time.fps){
    this.switchState(this.statePreShoot);
  }
};

Match3.Cowboy.prototype.shootOrMiss = function(){
  this.time = 0;
  let randNum = Math.floor( Math.random() * 100);
  if(randNum <= this.hitChance){
    this.play('shoot');
    if(this.name === 'turtle'){
      this.animations.currentAnim.speed = 12;
    }
    else if(this.name === 'regular'){
      this.animations.currentAnim.speed = 3;
    }
    else if(this.name === 'sniper'){
      this.animations.currentAnim.speed = 6;
    }
    this.state.damagePlayer(this.damage);
  } else {
    if(this.name != 'turtle'){
      this.animations.play('miss'); 
      this.animations.currentAnim.speed = 2;
    } else {
      this.animations.play('shoot');
      this.animations.currentAnim.speed = 12;
    }
  }    
  
  this.isTimePaused = false;
  this.shots--;
  if (this.shots < 1){
    this.switchState(this.statePostShoot);
  } else {
    this.switchState(this.stateShoot);
  }
};
Match3.Cowboy.prototype.stateShoot = function(){
  if (this.time >= this.shootDuration * this.game.time.fps){
    this.shootOrMiss();
  }
};
Match3.Cowboy.prototype.statePreShoot = function(){
  this.setCover(false);
  this.animations.play('idle'); 
  if (this.time >= this.preShootDuration * this.game.time.fps){
    this.switchState(this.stateShoot);
  }
};
Match3.Cowboy.prototype.statePostShoot = function(){
  this.shots = this.maxShots;
  this.setCover(false);
  if (this.animations.currentAnim.name == 'shoot' && this.animations.currentAnim.frame === 0){
    this.animations.play('idle'); 
  }
  if (this.time >= this.postShootDuration * this.game.time.fps){
    this.switchState(this.stateCovering);
  }
};
