var PuzzleBang = PuzzleBang || {};
// RESERVE  - - - 
PuzzleBang.GameState.createReserveBullet = function(x, y, data, variation){
  // Kreira 'PuzzleBang.Bullet' prefab u 'blocks' grupu
  // Ako ne, resetira 
  let bullet = this.reserveSlots.getFirstExists(false);
  if (!bullet){
    bullet = new PuzzleBang.Bullet(this, x, y, data, variation);
    this.reserveSlots.add(bullet); 
  }else{
    bullet.reset(x, y, data);
  }
  return bullet;
};
PuzzleBang.GameState.drawReserveBullets = function(){
  let i, j;
  // RESERVE
  for (i = 0; i < this.RESERVE_SLOTS; i++){
    x = this.revolver.reserveSlots[i].x;
    y = this.revolver.reserveSlots[i].y;
    this.createReserveBullet(x, y, {asset: 'bullet' + this.revolver.reserveSlots[i].variation, row: i, col: j, isReserve: true, multiplier: this.revolver.reserveSlots[i].multiplier},  this.revolver.reserveSlots[i].variation);
  }
  this.game.world.bringToTop(this.reserveSlots);
};
PuzzleBang.GameState.switchReserve = function(){
  let i, bullet, temp, x, y;
  // izvuč prvi po redu i pushat ga na kraj arraya
  // OVO NE FUNCKIONIRA ZA DRUGI BROJ SLOTOVA OD 3!
  temp = this.reserveSlots.getChildAt(0);
  this.reserveSlots.forEach(function(child){
    this.reserveSlots.moveUp(child);
    this.reserveSlots.moveUp(temp);
  }, this);
  // update Sprites
  for(i=0; i < this.reserveSlots.length;i++){
    let bulletMotion;
    x = this.revolver.reserveSlots[i].x;
    y = this.revolver.reserveSlots[i].y;
    bullet = this.reserveSlots.getAt(i);
    bullet.resetSprite('bullet' + this.revolver.reserveSlots[i].variation, this.revolver.reserveSlots[i].variation, this.revolver.reserveSlots[i].multiplier);
    // ovo samo updejta pozicije
    //bullet.resetSpritePos(x, y);
    // ovo ih animira
    bulletMotion = this.game.add.tween(bullet);
    bulletMotion.to( {x: x, y: y} , this.ANIMATION_TIME/2, Phaser.Easing.Elastic.In, false, 0);
    bulletMotion.start();
  }
};
PuzzleBang.GameState.updateReserveSprites = function(){
  let i, bullet;
  // update Sprites
  for(i=0; i < this.reserveSlots.length;i++){
    x = this.revolver.reserveSlots[i].x;
    y = this.revolver.reserveSlots[i].y;
    bullet = this.reserveSlots.getAt(i);
    bullet.resetSprite('bullet' + this.revolver.reserveSlots[i].variation, this.revolver.reserveSlots[i].variation, this.revolver.reserveSlots[i].multiplier);
  }
};

PuzzleBang.GameState.addToReserve = function(variation, multiplier){
  if (variation != 0){
    // OVO NE FUNCKIONIRA ZA DRUGI BROJ SLOTOVA OD 3!
    let i, bullet;
    for (i=0; i < this.revolver.reserveSlots.length; i++){
      if(this.revolver.reserveSlots[i].variation == 0 || i == this.revolver.reserveSlots.length-1){
        this.revolver.reserveSlots[i].variation = variation;
        this.revolver.reserveSlots[i].multiplier = multiplier;
        bullet = this.reserveSlots.getAt(i);
        bullet.resetSprite('bullet' + this.revolver.reserveSlots[i].variation, this.revolver.reserveSlots[i].variation, this.revolver.reserveSlots[i].multiplier);
        // dodaj automatski u slot ako je prazan
        let revolverSlotNum = this.revolver.revolverSlots.length - 1;
        if (this.revolver.revolverSlots[revolverSlotNum].variation == 0){
          this.loadRevolver();
        }
        return;
      }
    }
  }
};
PuzzleBang.GameState.swapReserveBullets = function(bullet1, bullet2){
  let bullet1Movement = this.game.add.tween(bullet1);
  bullet1Movement.to({x: bullet2.x, y: bullet2.y}, this.ANIMATION_TIME);
  bullet1Movement.onComplete.add(function(){
    // swappanje
    this.revolver.swapReserveBullets(bullet1, bullet2);
  }, this);
  bullet1Movement.start();

  let bullet2Movement = this.game.add.tween(bullet2);
  bullet2Movement.to({x: bullet1.x, y: bullet1.y}, this.ANIMATION_TIME,Phaser.Easing.Circular.InOut, false);
  bullet2Movement.onComplete.add(function(){
    // swappanje
    this.clearReserveSelection();
  }, this);
  bullet2Movement.start();
};

PuzzleBang.GameState.pickReserveBullet = function(selectedBullet){
  // only swap if the UI is not blocked
  if(this.isBoardBlocked){
    return;
  }
  // if there is nothing selected
  if(!this.selectedReserveBullet){
    // highlight the first reserve bullet
    selectedBullet.frame = selectedBullet.multiplier + 2;
    console.log(selectedBullet.multiplier);
    this.selectedReserveBullet = selectedBullet;
  } else {
    // second bullet you are selecting is target reserve bullet
    this.targetReserveBullet = selectedBullet;
    // Block the UI
    this.isBoardBlocked = true;
    // swap reserve bullet
    this.swapReserveBullets(this.selectedReserveBullet, this.targetReserveBullet);
    
    // izbriše Swipe reference
    this.currentHoverReserve = null;
    this.firstHoverReserve = null;
  }
};
PuzzleBang.GameState.clearReserveSelection = function(){
  this.isBoardBlocked = false;
  this.selectedReserveBullet.frame = this.selectedReserveBullet.multiplier - 1;
  this.targetReserveBullet.frame = this.targetReserveBullet.multiplier - 1;
  this.selectedReserveBullet = null;
  this.targetReserveBullet = null;
};
// RESERVE END - - -   