var Match3 = Match3 || {};

// BOARD I BLOCKOVI [][][][][][]
Match3.GameState.createBlock = function(x, y, data){
  // Kreira 'Match3.Block' prefab u 'blocks' grupu
  // Ako ne, resetira 
  let block = this.blocks.getFirstExists(false);
  if (!block){
    block = new Match3.Block(this, x, y, data);
    this.blocks.add(block); 
  }else{
    block.reset(x, y, data);
  }
  block.scale.setTo(this.BLOCK_SPRITE_SIZE);
  return block;
};
Match3.GameState.drawBoard = function(){
  let i, j;
  for (i = 0; i < this.NUM_ROWS; i++){
    this.boardPositionGrid.push([]);
    for (j = 0; j < this.NUM_COLS; j++){
      this.boardPositionGrid[i].push(0);
      this.boardPositionGrid[i][j] = {x: this.BOARD_POS.x + j * (this.BLOCK_SIZE + this.blocksGap), y: this.BOARD_POS.y + i * (this.BLOCK_SIZE + this.blocksGap)};
      // Kreaira BLOCKOVE
      this.createBlock(this.boardPositionGrid[i][j].x, this.boardPositionGrid[i][j].y, {asset: 'block' + this.board.grid[i][j], row: i, col: j} );
    }
  }
  this.game.world.bringToTop(this.blocks);
};
Match3.GameState.getBlockFromColRow = function(position){
  let foundBlock;
  this.blocks.forEachAlive(function(block){
    if(block.row === position.row && block.col === position.col){
        foundBlock = block;
    }
  }, this);
  return foundBlock;
};
Match3.GameState.dropBlock = function(sourceRow, targetRow, col){
  let block = this.getBlockFromColRow({row: sourceRow, col: col}),
      targetY = this.BOARD_POS.y + targetRow * (this.BLOCK_SIZE + this.blocksGap);
  block.row = targetRow;

  let blockMovement = this.game.add.tween(block);
  blockMovement.to({y: targetY}, this.ANIMATION_TIME);
  blockMovement.start();
};
Match3.GameState.dropReserveBlock = function(sourceRow, targetRow, col){
  let x = this.BOARD_POS.x + col * (this.BLOCK_SIZE + this.blocksGap),
      y = -(this.BLOCK_SIZE + this.blocksGap) * this.board.RESERVE_ROW + sourceRow * (this.BLOCK_SIZE + this.blocksGap),
      block = this.createBlock(x, y, {asset: 'block' +  this.board.grid[targetRow][col], row: targetRow, col: col}),
      targetY = this.BOARD_POS.y + targetRow * (this.BLOCK_SIZE + this.blocksGap),
      blockMovement = this.game.add.tween(block);
  blockMovement.to({y: targetY}, this.ANIMATION_TIME);
  blockMovement.start();
};
Match3.GameState.swapBlocks = function(block1, block2){
  // when swapping scale block back to 1
  block1.scale.setTo(this.BLOCK_SPRITE_SIZE);

  let block1Movement = this.game.add.tween(block1);
  block1Movement.to({x: block2.x, y: block2.y}, this.ANIMATION_TIME);
  block1Movement.onComplete.add(function(){
    // after the animation we update the model
    this.board.swap(block1, block2);
      if(!this.isReversingSwap){
        let chains = this.board.findAllChains();
        if(chains.length > 0){
          this.updateBoard(block1);
        } else {
          this.isReversingSwap = true;
          this.swapBlocks(block1, block2);
        }
      } else {
        this.isReversingSwap = false;
        this.clearSelection();
      }
  }, this);
  block1Movement.start();

  let block2Movement = this.game.add.tween(block2);
  block2Movement.to({x: block1.x, y: block1.y}, this.ANIMATION_TIME,Phaser.Easing.Circular.InOut, false);
  block2Movement.start();
};
Match3.GameState.pickBlock = function(block){
  // Ukljucuje natrag da se moze Chain Dodat u Reserve Slot
  this.isChainAddable = true;
  // only swap if the UI is not blocked
  if(this.isBoardBlocked){
    return;
  }
  // if there is nothing selected
  if(!this.selectedBlock){
    // highlight the first block
    block.frame = 1;
    this.selectedBlock = block;
  } else {
    // second block you are selecting is target block
    this.targetBlock = block;
    // only adjacent blocks can swap
    if(this.board.checkAdjacent(this.selectedBlock, this.targetBlock) ){
      // Block the UI
      this.isBoardBlocked = true;
      // swap blocks
      this.swapBlocks(this.selectedBlock, this.targetBlock);
      this.firstHoverBlock = null;
      this.currentHoverBlock = null;
    } else {
      this.clearSelection();
      this.firstHoverBlock = null;
      this.currentHoverBlock = null;
    }
  }
};
Match3.GameState.clearSelection = function(){
  this.isBoardBlocked = false;
  this.selectedBlock = null;
  // !!!??? ovo sam samo ja doda, neznan oće radit probleme
  this.targetBlock = null;
  this.blocks.setAll('frame', 0);
};
Match3.GameState.updateBoard = function(block){ // called from swapBlocks
  this.board.clearChains(block);
  this.board.updateGrid();
  // after the dropping has ended
  this.game.time.events.add(this.ANIMATION_TIME, function(){
    // see if there are new chains
    let chains = this.board.findAllChains();
    if(chains.length > 0 ){
      this.updateBoard();
    } else {
      this.clearSelection();        
    }
  }, this); // time event end
};
Match3.GameState.updateBoardSprites = function(block){ // called from swapBlocks
  if (!this.isBoardBlocked){
    this.board.clearChains(block);
    this.board.updateGrid();
    // after the dropping has ended
    this.game.time.events.add(this.ANIMATION_TIME, function(){
      // see if there are new chains
      let chains = this.board.findAllChains();
      if(chains.length > 0 ){
        this.updateBoard();
      } else {
        this.clearSelection();        
      }
    }, this); // time event end
  }
};
Match3.GameState.getBlockVariation = function(){
  let i, variation, largest,
      chances = [],
      max = 0;
  for (i = 0; i < this.NUM_VARIATIONS; i++){
    let randNum = Math.floor(Math.random() * this.blockData.levelInfo[this.level].chance[i]) ;
    chances.push({randNum: randNum, variation: i + 1});
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
Match3.GameState.updateBlockPositions = function(){
  let i, j;
  for (i = 0; i < this.NUM_ROWS; i++){
    for (j = 0; j < this.NUM_COLS; j++){
      this.boardPositionGrid[i][j].x = this.BOARD_POS.x + j * (this.BLOCK_SIZE + this.blocksGap);
      this.boardPositionGrid[i][j].y = this.BOARD_POS.y + i * (this.BLOCK_SIZE + this.blocksGap);
    }
  } 
  this.blocks.forEachAlive(function(block){
    block.updatePosition();
  }, this);
};
// BOARD I BLOCKOVI END [][][][][][]
