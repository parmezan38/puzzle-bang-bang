var Match3 = Match3 || {};

Match3.Board = function(state, rows, cols, blockVariations) {
  this.state = state;
  this.rows = rows;
  this.cols = cols;
  this.blockVariations = blockVariations;

  //main grid
  this.grid = [];
  let i,j;
  for(i = 0; i < rows; i++) {
    this.grid.push([]);
    for(j = 0; j < cols; j++) {
      this.grid[i].push(0);
    }
  }
  //reserve grid on the top, for when new blocks are needed
  this.reserveGrid = [];
  this.RESERVE_ROW = rows;
  for(i = 0; i < this.RESERVE_ROW; i++) {
    this.reserveGrid.push([]);
    for(j = 0; j < cols; j++) {
      this.reserveGrid[i].push(0);
    }
  }
  // populate grids
  this.populateGrid();
  this.populateReserveGrid();
};
Match3.Board.prototype.populateGrid = function(){
  let i,j,variation;
  for(i = 0; i < this.rows; i++) {
    for(j = 0; j < this.cols; j++) {
      // Old
      variation = this.state.getBlockVariation();
      this.grid[i][j] = variation;
    }
  }
  // if there are any chains, re-populate
  let chains = this.findAllChains();
  if(chains.length > 0){
    this.populateGrid();
  }
};

Match3.Board.prototype.findAllChainsAndRepopulate = function(){
  let chains = this.findAllChains();
  if(chains.length > 0){
    this.populateGrid();
  }
};

Match3.Board.prototype.populateReserveGrid = function(){
  let i,j,variation;
  for(i = 0; i < this.RESERVE_ROW; i++) {
    for(j = 0; j < this.cols; j++) {
      variation = this.state.getBlockVariation();
      this.reserveGrid [i][j] = variation;
    }
  }
 };
Match3.Board.prototype.consoleLog = function(){
  let i,j,
      prettyString = '';
  for(i = 0; i < this.RESERVE_ROW; i++) {
    prettyString += '\n';
    for(j = 0; j < this.cols; j++) {
      prettyString += ' ' + this.reserveGrid[i][j];
    }
  }
  prettyString += '\n';
  for(j = 0; j < this.rows; j ++) {
    prettyString += ' -' ;
  }
  
  for(i = 0; i < this.rows; i++) {
    prettyString += '\n';
    for(j = 0; j < this.cols; j++) {
      prettyString += ' ' + this.grid[i][j];
    }
  }
  console.log(prettyString);
};
// Swapping Blocks
Match3.Board.prototype.swap = function(source, target){
  let temp = this.grid[target.row][target.col];
  this.grid[target.row][target.col] = this.grid[source.row][source.col];
  this.grid[source.row][source.col] = temp;  
  
  let tempPos = {row: source.row, col: source.col};
  source.row = target.row;
  source.col = target.col;
  target.row = tempPos.row;
  target.col = tempPos.col;
};
// Check if two blocks are adjacent
Match3.Board.prototype.checkAdjacent = function(source, target){
  let diffRow = Math.abs(source.row - target.row),
      diffCol = Math.abs(source.col - target.col),
      isAdjacent = (diffRow === 1 && diffCol === 0) || (diffRow === 0 && diffCol === 1);
  return isAdjacent;
};
// Check whether a single block is chained or not
Match3.Board.prototype.isChained = function(block){
  let isChained = false,
      variation = this.grid[block.row][block.col],
      row = block.row,
      col = block.col;
  // left
  if (this.grid[col - 2]){
    if (variation == this.grid[row][col - 1] && variation == this.grid[row][col - 2]){
    isChained = true; } }
  // right
  if (this.grid[col + 2]){
    if (variation == this.grid[row][col + 1] && variation == this.grid[row][col + 2]){
    isChained = true; } }
  // up
  if (this.grid[row - 2]){
    if (variation == this.grid[row - 1][col] && variation == this.grid[row - 2][col]){
    isChained = true; } }  
  // down
  if (this.grid[row + 2]){
    if (variation == this.grid[row + 1][col] && variation == this.grid[row + 2][col]){
    isChained = true; } }
  // center - horizontal
  if (variation == this.grid[row][col - 1] && variation == this.grid[row][col + 1]){
    isChained = true; } 
  // center - vertical
  if (this.grid[row + 1] && this.grid[row -  1]){
    if (variation == this.grid[row - 1][col] && variation == this.grid[row + 1][col]){
      isChained = true; } }
  return isChained;
}; // isChained end

// Find All Chains
Match3.Board.prototype.findAllChains = function(){
  let chained = [],
      i, j;
  for(i = 0; i < this.rows; i++) {
    for(j = 0; j < this.cols; j++) {
      if(this.isChained( {row: i, col: j} ) ){
        chained.push({row: i, col: j} );
      }
    }
  } // for loop end
  return chained;
}; // findAllChains end

// Find First Chain
Match3.Board.prototype.findFirstChain = function(block, variation){
  let chained = [],
      i, j;
  for(i = 0; i < this.rows; i++) {
    for(j = 0; j < this.cols; j++) {
      if(this.isChained( {row: i, col: j} ) ){
        if (this.grid[i][j] === variation){
          chained.push({row: i, col: j} );
        }
      }
    }
  } // for loop end
  return chained;
}; // findFirstChain end

// Clear all Chains
Match3.Board.prototype.clearChains = function(block){ // called from GameBoard.updateBoard
  let variation = 0,
      multiplier = 1,
      shakeStrength,
      firstChain;
  if (this.state.isChainAddable){
    variation = this.grid[block.row][block.col];
    firstChain = this.findFirstChain(block, variation);
    if(firstChain.length <= 3){
      multiplier = 1;
    }else if(firstChain.length === 4){
      multiplier = 2;
    }
    else if(firstChain.length >= 5){
      multiplier = 3;
    }
  }
  // get all blocks that need to be cleared
  let chainedBlocks = this.findAllChains(); //
  if(chainedBlocks.length < 4){
    shakeStrength = 0.002;
  }else if(chainedBlocks.length > 4 && chainedBlocks.length < 5){
    shakeStrength = 0.003;
  }
  else if(chainedBlocks.length > 5){
    shakeStrength = 0.004;
  }
  // set them to zero
  chainedBlocks.forEach(function(block){
    this.state.isChainAddable = false;
    
    this.grid[block.row][block.col] = 0; 
    
    // SCREEN SHAKE
    this.state.camera.shake(shakeStrength, 100, true, Phaser.Camera.SHAKE_HORIZONTAL , true);
    
    // kill the block object
    this.state.getBlockFromColRow(block).kill();
  }, this);
  
  // ADD TO RESERVE
  if(variation != 1){
    this.state.healPlayer(1);
  }
  if(variation != 1){
    this.state.addToReserve(variation, multiplier);
  }
};
// Clear all Blocks
Match3.Board.prototype.clearBlocks = function(){
  // get all blocks that need to be cleared
  let allBlocks = [],
      i, j;
  for(i = 0; i < this.rows; i++) {
    for(j = 0; j < this.cols; j++) {
      allBlocks.push({row: i, col: j} );
    }
  } // for loop end
  // set them to zero
  allBlocks.forEach(function(block){
    this.grid[block.row][block.col] = 0; 
    // kill the block object
    this.state.getBlockFromColRow(block).kill();
  }, this);
};

// Dropping
// Drop block in the main grid to another position. set source to zero
Match3.Board.prototype.dropBlock = function(sourceRow, targetRow, col){
  this.grid[targetRow][col] = this.grid[sourceRow][col];
  this.grid[sourceRow][col] = 0;
  this.state.dropBlock(sourceRow, targetRow, col);
};
// Drop block from the reserve grid to main grid. set source to zero
Match3.Board.prototype.dropReserveBlock = function(sourceRow, targetRow, col){
  this.grid[targetRow][col] = this.reserveGrid[sourceRow][col];
  this.reserveGrid[sourceRow][col] = 0;
  this.state.dropReserveBlock(sourceRow, targetRow, col);
};

// move down blocks to fill in empty slots
Match3.Board.prototype.updateGrid = function(){
  let i,j,k, foundBlock;
  // go trough all the rows, from the bottom up
  for(i = this.rows -1; i >= 0; i--){
    for(j = this.cols - 1; j >= 0; j--){
      // if the block is 0, then get climb up to get a non-zero one
      if(this.grid[i][j] === 0){
        foundBlock = false; 
        // climb up the main grid
        for(k = i - 1; k >= 0; k--){
          if(this.grid[k][j] != 0){
            this.dropBlock(k, i, j);
            foundBlock = true;
            break;
          }
        }
        if(!foundBlock){
          // climb up in the reserve grid
          for(k = this.RESERVE_ROW - 1; k >= 0; k--){
            if(this.reserveGrid[k][j] != 0){
              this.dropReserveBlock(k, i, j);
              foundBlock = true;
              break;
            }
          }
        } // reserve block find end
      }   
    } // main for loop end
  }
  // repopulate the reserve grid
  this.populateReserveGrid();
}; // updateGrid end
