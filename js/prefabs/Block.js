var Match3 = Match3 || {};

Match3.Block = function(state, x, y, data) {
  Phaser.Sprite.call(this, state.game, x, y, data.asset);
  this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
  this.asset = data.asset;
  this.game = state.game;
  this.state = state;
  this.row = data.row;
  this.col = data.col; 
  this.anchor.setTo(0.5);
  this.smoothed = false;
};

Match3.Block.prototype = Object.create(Phaser.Sprite.prototype);
Match3.Block.prototype.constructor = Match3.Block;

Match3.Block.prototype.reset = function(x, y, data){
  Phaser.Sprite.prototype.reset.call(this, x, y);
  this.loadTexture(data.asset);
  this.row = data.row;
  this.col = data.col; 
}; 

Match3.Block.prototype.kill = function(){
  this.loadTexture('deadBlock');
  this.col = null;
  this.row = null;
  this.game.time.events.add(this.state.ANIMATION_TIME/2, function(){
      Phaser.Sprite.prototype.kill.call(this);
  }, this);
};
Match3.Block.prototype.updatePosition = function(){
  this.x = this.state.boardPositionGrid[this.row][this.col].x;
  this.y = this.state.boardPositionGrid[this.row][this.col].y;
}; // updatePosition end