var Match3 = Match3 || {};
// REVOLVER O O O O O O
Match3.GameState.addSmokeEmitter = function(){
  this.smokeEmitter = this.game.add.emitter(0, 0, 100);
  this.revolverAndSmoke.add(this.smokeEmitter);
  this.smokeEmitter.makeParticles('pxl9x_grey');
  this.smokeEmitter.gravity = -200;
  this.smokeEmitter.setXSpeed(1, -1);
  this.smokeEmitter.setYSpeed(0, 0);
  this.smokeEmitter.setAlpha(1, 0, 1200, Phaser.Easing.Linear.Out);
  this.smokeEmitter.setScale(1, 2);
};
Match3.GameState.startSmokeEmitter = function(){
  let randNum = (Math.random() * 6) - 3;
  this.smokeEmitter.emitX = randNum;
  this.game.add.tween(this.smokeEmitter).to( { emitX: randNum * -1 }, 250, Phaser.Easing.Sinusoidal.InOut, true, 0, Number.MAX_VALUE, true);
  this.smokeEmitter.start(false, 1500 + (randNum * 20), 6, 20);
};
Match3.GameState.addSpritesToRevolver = function(){
  this.revolverSprite = this.add.sprite(0, 0, 'revolver');
  this.revolverSprite.anchor.setTo(0.5);
  this.revolverGroup.add(this.revolverSprite);
};
Match3.GameState.createRevolverBullet = function(x, y, data, variation){
  let bullet = this.revolverSlots.getFirstExists(false);
  if (!bullet){
    bullet = new Match3.Bullet(this, x, y, data, variation);
    this.revolverSlots.add(bullet); 
  }else{
    bullet.reset(x, y, data);
  }
  return bullet;
};
Match3.GameState.drawRevolverBullets = function(){
  let i, revolverBullet, x, y;
  for (i = 0; i < this.REVOLVER_SLOTS; i++){
    x = this.revolver.revolverSlots[i].x;
    y = this.revolver.revolverSlots[i].y;
    revolverBullet = this.createRevolverBullet(x, y, {asset: 'bullet' + this.revolver.revolverSlots[i].variation, isReserve: false, multiplier: this.revolver.revolverSlots[i].multiplier}, this.revolver.revolverSlots[i].variation);
    this.revolverSlots.add(revolverBullet);
  }
  this.game.world.bringToTop(this.revolverSlots);
};
Match3.GameState.updateRevolverSlots = function(revolverAngle){
  let i, bullet, temp;
  // izvuč "barreled" (0) i pushat ga na kraj arraya    
  temp = this.revolverSlots.getChildAt(0);
  this.revolverSlots.forEach(function(child){
    this.revolverSlots.moveUp(child);
    this.revolverSlots.moveUp(temp);
  }, this);
  // update Sprites
  for(i=0; i < this.revolverSlots.length; i++){
    bullet = this.revolverSlots.getAt(i);
    bullet.resetSprite('bullet' + this.revolver.revolverSlots[i].variation, this.revolver.revolverSlots[i].variation, this.revolver.revolverSlots[i].multiplier, revolverAngle);
  }
};
Match3.GameState.updateRevolverSprites = function(){
  let i, bullet;
  // update Sprites
  for(i=0; i < this.revolverSlots.length; i++){
    bullet = this.revolverSlots.getAt(i);
    bullet.resetSprite('bullet' + this.revolver.revolverSlots[i].variation, this.revolver.revolverSlots[i].variation, this.revolver.revolverSlots[i].multiplier);
  }
};
Match3.GameState.rotateRevolver = function(){
  // rotate sprites
  let origRot = this.revolverGroup.angle,
      newRot = origRot + 60,
      revolverRotate = this.game.add.tween(this.revolverGroup);
  revolverRotate.to( {angle: newRot} , this.ANIMATION_TIME * 2.3, Phaser.Easing.Elastic.InOut, false, 0);

  revolverRotate.onComplete.add(function(){
    // rotate revolver array
    this.revolver.rotate();
    //this.revolver.consoleLog();
    this.revolverGroup.angle = Math.round(newRot);
    if (this.revolverGroup.angle > 359 && this.revolverGroup.angle < 361){
      this.revolverGroup.angle = 0;
    }
    // update Sprites
    this.updateRevolverSlots(this.revolverGroup.angle); 
    // load revolver slot funkcija
    if(this.revolver.reserveSlots[0].variation != 0){
      this.loadRevolver();
    } else {
      this.isBoardBlocked = false;
    }
    // rotate all Bullets
    this.rotateRevolverSprites(this.revolverGroup.angle);
  }, this);
  revolverRotate.start();
};
Match3.GameState.rotateRevolverSprites = function(){
  if (this.revolverGroup.angle > 359 && this.revolverGroup.angle < 361){
    this.revolverSlots.forEach(function(child){
      child.angle = 0;
    }, this);
    this.revolverSprite.angle = 0;
  } else {
    this.revolverSlots.forEach(function(child){
      child.angle += 120;
    }, this);
    this.revolverSprite.angle += 120;
  }
};
Match3.GameState.rotateRevolverToFullSlot = function(){
    let thisthis = this;
    function func(){
      if (thisthis.revolver.revolverSlots[0].variation != 0){
        return;
      } else {
        let origRot = thisthis.revolverGroup.angle,
            newRot = origRot + 60,
            revolverRotate = thisthis.game.add.tween(thisthis.revolverGroup);
        revolverRotate.to( {angle: newRot} , thisthis.ANIMATION_TIME / 5);
        revolverRotate.onComplete.add(function(){
          // rotate revolver array
          thisthis.revolver.rotate();
          thisthis.revolverGroup.angle = Math.round(newRot);
          if (thisthis.revolverGroup.angle > 359 && thisthis.revolverGroup.angle < 361){
            thisthis.revolverGroup.angle = 0; }
          thisthis.updateRevolverSlots(thisthis.revolverGroup.angle); // update Sprites
            // rotate all Bullets
          thisthis.rotateRevolverSprites(thisthis.revolverGroup.angle);

          // dodaj automatski u slot ako je prazan
          if (thisthis.revolver.revolverSlots[0].variation != 0){
            let firstReserveSlot = thisthis.reserveSlots.getChildAt(0);
            if(firstReserveSlot.variation != 0){ thisthis.loadRevolver(); }
          } else {
            // LOOP FUNCTION
            func();
          }
        });
      revolverRotate.start();
    }
  }
  func();
};
Match3.GameState.loadRevolver = function(){ // Mova prvi Sprite iz 
  let bullet, slot, newX, newY, motion;
  bullet = this.reserveSlots.getChildAt(0);
  
  slot = this.revolverSlots.getChildAt(5);
  newX = slot.position.x;
  newY = slot.position.y;
  motion = this.game.add.tween(bullet);
  motion.to( {x: newX, y: newY} , this.ANIMATION_TIME*0.6, Phaser.Easing.Linear.None, true, 0);
  motion.onComplete.add(function(){
    slot.variation = bullet.variation;
    slot.multiplier = bullet.multiplier;
    // update Sprites i Revolver Array
    slot.resetSprite('bullet' + slot.variation, slot.variation, slot.multiplier);
    this.revolver.revolverSlots[5].variation = slot.variation;
    this.revolver.revolverSlots[5].multiplier = slot.multiplier;
    // kill Bullet and Array Object
    this.revolver.switchReserve();
    this.switchReserve();

    this.isBoardBlocked = false;
    // Kraj Shoot Chaina
  }, this);
  motion.start();
};
Match3.GameState.getBulletVariation = function(){
  let i, variation, largest,
      chances = [],
      max = 0;
  for (i = 0; i < this.NUM_VARIATIONS; i++){
    if(i != 0){
      let randNum = Math.floor(Math.random() * this.blockData.levelInfo[this.level].chance[i]) ;
      chances.push({randNum: randNum, variation: i + 1});
    }
  }
  for (i = 0; i < chances.length; i++){
    if (chances[i].randNum > max){
      max = chances[i].randNum;
      largest = chances[i];
    }
  }
  variation = largest.variation;
  return variation;
};
Match3.GameState.recoilRevolver = function(){
  let origY = this.revolverGroup.y,
      recoilStart = this.game.add.tween(this.revolverGroup);
  recoilStart.to( { y: this.revolverGroup.y + 10}, 150, Phaser.Easing.Elastic.Out);
  recoilStart.onComplete.add(function(){
    let recoilEnd = this.game.add.tween(this.revolverGroup);
    recoilEnd.to( { y: origY}, 250, Phaser.Easing.Elastic.Out);
    recoilEnd.start();
  }, this);
  recoilStart.start();
};
