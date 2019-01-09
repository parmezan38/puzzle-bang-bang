var Match3 = Match3 || {};

Match3.GameState.createEnemy = function(x, y, variation, timeOffset, gridPos){        
  let enemy = this.enemies.getFirstExists(false);
  if(!enemy){
    enemy = new Match3.Cowboy(this, x, y, timeOffset, this.enemyInfo[variation - 1], gridPos);
    this.enemies.add(enemy);
    gridPos.enemy = variation;
  } 
}; // createEnemy end

Match3.GameState.addEnemies = function(){
  let nextPosition = null,
      i, randNum;
  for(i = 0; i < this.enemyPositions.levelInfo[this.level][this.wave].variations.length; i++) {
    this.findFreeCoverSpot();
    // Time Offset
    randNum = Math.floor( (Math.random() * 220) );
    randNum -= 110;
    if(this.shouldEnemyBeSpawnedBehindCover(this.enemyPositions.levelInfo[this.level][this.wave].difficulty) ){
      // Check da li postoji prazno cover mjesto
      if(this.getRandomFreeCoverSpot() === 0){
        nextPosition = this.getRandomFreeOpenSpot();
      } else {
        nextPosition = this.getRandomFreeCoverSpot();
      }
      this.createEnemy(nextPosition.x, nextPosition.y, this.enemyPositions.levelInfo[this.level][this.wave].variations[i], randNum, nextPosition);
    } else {
      // Check da li postoji prazno open mjesto
      if(this.getRandomFreeOpenSpot() === 0){
        nextPosition = this.getRandomFreeCoverSpot();
      } else {
        nextPosition = this.getRandomFreeOpenSpot();
      }
      this.createEnemy(nextPosition.x, nextPosition.y, this.enemyPositions.levelInfo[this.level][this.wave].variations[i], randNum, nextPosition);
    }
  }
  // Addanje broja neprijatelja u globalnu variablu, da se prati kad treba počet novi wave
  this.enemiesOnScreen = this.enemyPositions.levelInfo[this.level][this.wave].variations.length;
  this.canAddEnemies = true;
}; // addEnemies end

Match3.GameState.startAddingEnemies = function(){
  let thisthis = this,
    addEnemiesDelay = this.game.time.create(false);
  addEnemiesDelay.add(this.WAVE_DELAY, function(){
    thisthis.addEnemies();
  }, this, false);
  addEnemiesDelay.start();
}; // startAddingEnemies end

Match3.GameState.shouldEnemyBeSpawnedBehindCover = function(difficulty){
  let shouldSpawnBehindCover, num;
  num = Math.floor(Math.random() * 100);
  if(num < difficulty){
    shouldSpawnBehindCover = true;
  } else {
    shouldSpawnBehindCover = false;
  }
  return shouldSpawnBehindCover;
}; // shouldEnemyBeSpawnedBehindCover end

Match3.GameState.findFreeCoverSpot = function(){
  this.coverSpots = [];
  this.freeCoverSpots = [];
  this.freeOpenSpots = [];
  let i, j;
  // Find Cover Spots
  for(i = 0; i < this.worldGrid.length; i++) {
    for(j = 0; j < this.worldGrid[i].length; j++) {
      if(this.worldGrid[i][j].cover === 0){
        // prazni spot
      } else {
        this.coverSpots.push(this.worldGrid[i][j]);
      }
    }
  }
  // Find FREE Cover Spots
  for(i = 0; i < this.coverSpots.length; i++) {
    if(this.coverSpots[i].enemy === 0){
      // nema enemya na tom coveru
      this.freeCoverSpots.push(this.coverSpots[i]);
    } 
  }
  // Find FREE Open Spots
  for(i = 0; i < this.worldGrid.length; i++) {
    for(j = 0; j < this.worldGrid[i].length; j++) {
      if(this.worldGrid[i][j].enemy === 0 && this.worldGrid[i][j].cover === 0){
        this.freeOpenSpots.push(this.worldGrid[i][j]);
      } 
    }
  }
}; // findFreeCoverSpot end

Match3.GameState.getRandomFreeOpenSpot = function(){
  let num, freeOpenSpot;
  num = Math.floor( (Math.random() * this.freeOpenSpots.length) );
  if (this.freeOpenSpots.length < 1){
    freeOpenSpot = 0;
  } else {
    freeOpenSpot = this.freeOpenSpots[num];
  }
  return freeOpenSpot;
}; // getRandomFreeSpot end

Match3.GameState.getRandomFreeCoverSpot = function(){
  let num, freeCoverSpot;
  num = Math.floor( (Math.random() * this.freeCoverSpots.length) );
  if (this.freeCoverSpots.length < 1){
    freeCoverSpot = 0;
  } else {
    freeCoverSpot = this.freeCoverSpots[num];
  }
  return freeCoverSpot;
}; // getRandomFreeCoverSpot end