var Match3 = Match3 || {};

Match3.Cover = function(state, x, y, data, gridPos) {
  Phaser.Sprite.call(this, state.game, x, y, data.asset);
  
  this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
  this.game = state.game;
  this.state = state;
  this.gridPos = gridPos;
  this.anchor.setTo(0.5, 1);
  // listen for input
  this.inputEnabled = false;
  this.smoothed = false;
  
  // specificne varijable
  this.isDead = false;
  this.coverHealth = data.health; 
  this.maxHealth = data.health; 
};

Match3.Cover.prototype = Object.create(Phaser.Sprite.prototype);
Match3.Cover.prototype.constructor = Match3.Cover;

Match3.Cover.prototype.damageCover = function(damage){
  if(!this.isDead){
    this.coverHealth -= damage;
    if (this.coverHealth <= 0){
      this.isDead = true;
      this.frame = 5;
    } else {
      this.changeSprite();
    }
  }
};
Match3.Cover.prototype.changeSprite = function(){
  if (this.coverHealth < (this.maxHealth * 0.8) ){
    this.frame = 1;
    if (this.coverHealth < (this.maxHealth * 0.6) ){
      this.frame = 2;
      if (this.coverHealth < (this.maxHealth * 0.4) ){
        this.frame = 3;
        if (this.coverHealth < (this.maxHealth * 0.2) ){
          this.frame = 4;
        }
      }
    }
  }
};
Match3.Cover.prototype.updatePosition = function(){
  this.x = this.state.worldGrid[this.gridPos.arrayY][this.gridPos.arrayX].x;
  this.y = this.state.worldGrid[this.gridPos.arrayY][this.gridPos.arrayX].y;
}; // updatePosition end