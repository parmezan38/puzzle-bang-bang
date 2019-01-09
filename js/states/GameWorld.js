var Match3 = Match3 || {};
Match3.GameState.createWorldGrid = function(){
  let i,j;
  // kreira array
  for(i = 0; i < this.ENEMY_POS_ROWS; i++) {
    this.worldGrid.push([]);
    for(j = 0; j < this.ENEMY_POS_COLS; j++) {
      this.worldGrid[i].push(0);
      this.worldGrid[i][j] = {x: 0, y: 0, z: 0, cover: 0, enemy: 0};
    }
  }
  // napravi mu informacije
  for(i = 0; i < this.ENEMY_POS_ROWS; i++) {
    for(j = 0; j < this.ENEMY_POS_COLS; j++) {
      this.worldGrid[i][j].x = this.ENEMY_BLOCK_SIZE.w/2 + j * this.ENEMY_BLOCK_SIZE.w;
      this.worldGrid[i][j].y = (this.ENEMY_BLOCK_SIZE.h + i * this.ENEMY_BLOCK_SIZE.h);
      this.worldGrid[i][j].arrayX = j;
      this.worldGrid[i][j].arrayY = i;
    }
  }
}; // createWorldGrid end

Match3.GameState.createCover = function(x, y, variation, gridPos){        
  let cover = this.covers.getFirstExists(false);
  if(!cover){
    cover = new Match3.Cover(this, x, y, this.coverInfo[variation - 1], gridPos);
    this.covers.add(cover);
    cover.x = x;
    cover.y = y;
    gridPos.cover = variation;
  }   
}; // createCover end

Match3.GameState.addCovers = function(){
  let i, variation;
  variation = Math.floor( (Math.random() * this.coverData.level1.length) );
  
  for(i = 0; i < this.ENEMY_POS_ROWS; i++) {
    for(j = 0; j < this.ENEMY_POS_COLS; j++) {   
      if(this.coverData.level1[variation][i][j] !== 0){
        let nextPosition = this.worldGrid[i][j];
        this.createCover(nextPosition.x, nextPosition.y, this.coverData.level1[variation][i][j], this.worldGrid[i][j]);
      }
    }
  }
}; // addCovers end

Match3.GameState.updateWorldPositions = function(){
  let i,j;
  // napravi mu informacije
  for(i = 0; i < this.ENEMY_POS_ROWS; i++) {
    for(j = 0; j < this.ENEMY_POS_COLS; j++) {
      this.worldGrid[i][j].x = this.ENEMY_BLOCK_SIZE.w/2 + j * this.ENEMY_BLOCK_SIZE.w;
      this.worldGrid[i][j].y = this.ENEMY_BLOCK_SIZE.h + i * this.ENEMY_BLOCK_SIZE.h;
    }
  }
}; // updateWorldPositions end

