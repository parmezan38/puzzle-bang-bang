var PuzzleBang = PuzzleBang || {};

PuzzleBang.Revolver = function(state, revolverSlotNum, reserveSlotNum) {
  this.state = state;
  this.revolverSlotNum = revolverSlotNum;
  this.reserveSlotNum = reserveSlotNum;
  this.rotation = 0;
  //Revolver
  this.revolverSlots = [];
  this.revolverSlotPositions = [
      {x: 0, y: -14}, // barreled
      {x: -12, y: -7},
      {x: -12, y: 7},
      {x: 0, y: 14},
      {x: 12, y: 7},
      {x: 12, y: -7}
  ];
  let i;
  for(i = 0; i < revolverSlotNum; i++) {
    this.revolverSlots.push([]);
  }
  
  //Reserve Slots
  this.reserveSlots = [];
  this.reserveSlotsPositions = [
      {x: 32, y: -5}, // first in line
      {x: 52, y: -7},
      {x: 70, y: -2},
      {x: 65, y: 14},
      {x: 50, y: 15},
      {x: 32, y: 15}
  ];
  let j;
  for(j = 0; j < reserveSlotNum; j++) {
    this.reserveSlots.push([]);
  }
  
  this.populateReserveSlots();
  this.populateRevolverSlots(); 
};

PuzzleBang.Revolver.prototype.consoleLog = function(){
  let i,
      prettyString = '';
  for(i = 0; i < this.revolverSlotNum; i++) {
    prettyString += '(' + this.revolverSlots[i].variation + 'x' + this.revolverSlots[i].multiplier + ')';
  }
  prettyString += '\n';
  prettyString += '[';
  for(i = 0; i < this.reserveSlotNum; i++) {
    prettyString += ' ' + this.reserveSlots[i].multiplier;
  }
  prettyString += ']';
};

PuzzleBang.Revolver.prototype.populateReserveSlots = function(){
  let i, variation;
  for(i = 0; i < this.reserveSlotNum; i++) {
    variation = this.state.getBulletVariation();
    this.reserveSlots[i] = {"variation": variation, "multiplier": 1, "x": this.reserveSlotsPositions[i].x, "y": this.reserveSlotsPositions[i].y};
  }
};
PuzzleBang.Revolver.prototype.populateRevolverSlots = function(){
  let i, variation;
  for(i = 0; i < this.revolverSlotNum; i++) {
    variation = this.state.getBulletVariation();
    this.revolverSlots[i] = {"variation": variation, "multiplier": 1, "x": this.revolverSlotPositions[i].x, "y": this.revolverSlotPositions[i].y};
  }
};
PuzzleBang.Revolver.prototype.rotate = function(){
  let temp;
  // izbacit "barreled" bullet
  this.revolverSlots[0].variation = 0;
  this.revolverSlots[0].multiplier = 1;
  // izvuč "barreled" (0) i pushat ga na kraj arraya
  temp = this.revolverSlots.shift();
  this.revolverSlots.push(temp);
};
PuzzleBang.Revolver.prototype.switchReserve = function(){
  let i, temp;
  // izbacit prvi na redu bullet
  this.reserveSlots[0].variation = 0;
  this.reserveSlots[0].multiplier = 1;
  // izvuč prvi na redu bullet (0) i pushat ga na kraj arraya
  temp = this.reserveSlots.shift();
  this.reserveSlots.push(temp);
  
  // update x i y po onom kako je redosljed
  for(i = 0; i < this.reserveSlots.length; i++) {
    this.reserveSlots[i].x = this.reserveSlotsPositions[i].x;
    this.reserveSlots[i].y = this.reserveSlotsPositions[i].y;
  }
};
// Swapping Reserve Bullets
PuzzleBang.Revolver.prototype.swapReserveBullets = function(source, target){
  let indexOfFirst, indexOfSecond, temp;
  indexOfFirst = this.state.reserveSlots.getChildIndex(source);
  indexOfSecond = this.state.reserveSlots.getChildIndex(target);
  
  // Array Objekt swap
  temp = this.reserveSlots[indexOfFirst];
  this.reserveSlots[indexOfFirst] = this.reserveSlots[indexOfSecond];
  this.reserveSlots[indexOfSecond] = temp;
  
  // Sprite Objekt swap
  this.state.reserveSlots.swapChildren(source, target);
};

// Clear all Bullets
PuzzleBang.Revolver.prototype.clearBullets = function(){
  let i, variation;
  for(i = 0; i < this.revolverSlots.length; i++) {
    variation = this.state.getBulletVariation();
    this.revolverSlots[i] = {"variation": variation, "multiplier": 1, "x": this.revolverSlotPositions[i].x, "y": this.revolverSlotPositions[i].y};
  }
  for(i = 0; i < this.reserveSlots.length; i++) {
    variation = this.state.getBulletVariation();
    this.reserveSlots[i] = {"variation": variation, "multiplier": 1, "x": this.reserveSlotsPositions[i].x, "y": this.reserveSlotsPositions[i].y};
  }
};
