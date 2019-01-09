var Match3 = Match3 || {};

Match3.Bullet = function(state, x, y, data, variation) {
  if (data.asset == 'bullet0'){
      Phaser.Sprite.call(this, state.game, x, y, 'bullet0');
  } else {
      Phaser.Sprite.call(this, state.game, x, y, data.asset);
  }
  this.game = state.game;
  this.state = state;
  this.anchor.setTo(0.5);
  this.variation = variation;
  this.isReserve = data.isReserve;
  this.multiplier = data.multiplier;
  
  if (data.asset == 'bullet0' && this.isReserve){
    this.alpha = 0.0;
  } else {
    this.alpha = 1;
  }
  // listen for input
  if(this.multiplier === 1){
    this.frame = 0;
  } else if (this.multiplier === 2) {
    this.frame = 1;
  } else {
    this.frame = 2;
  }
};

Match3.Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Match3.Bullet.prototype.constructor = Match3.Bullet;

Match3.Bullet.prototype.reset = function(x, y, data){
  Phaser.Sprite.prototype.reset.call(this, x, y);
  this.loadTexture(data.asset);
};
Match3.Bullet.prototype.resetSprite = function(asset, variation, multiplier){
  this.variation = variation;
  this.multiplier = multiplier;
  
  if (asset == 'bullet0'){
    this.loadTexture('bullet0');
  } else {
    this.loadTexture(asset);
  }
  if (asset == 'bullet0' && this.isReserve){
    this.alpha = 0.0;
  } else {
    this.alpha = 1;
  }
  
  if(this.multiplier === 1){
    this.frame = 0;
  } 
  else if (this.multiplier === 2) {
    this.frame = 1;
  } else {
    this.frame = 2;
  }
}; 

Match3.Bullet.prototype.resetSpritePos = function(x, y){
  this.x = x;
  this.y = y;
}; 

Match3.Bullet.prototype.kill = function(){
  this.loadTexture('bullet0');
  this.col = null;
  this.row = null;
  this.game.time.events.add(this.state.ANIMATION_TIME/2, function(){
    Phaser.Sprite.prototype.kill.call(this);
  }, this);
};