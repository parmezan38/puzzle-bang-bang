var Match3 = Match3 || {};

Match3.GameState.createEndLevelTexts = function(){
  this.youWonTxt = this.add.text(0, - 75, "YOU WON!");
  this.youWonTxt.targetX = 0;
  this.youWonTxt.targetY = -75;
  this.youWonTxt.anchor.setTo(0.5);
  this.youWonTxt.align = 'center';
  this.youWonTxt.fill = '#ffffff';
  this.youWonTxt.stroke = '#000000';
  this.youWonTxt.strokeThickness = 5;
  this.youWonTxt.alpha = 0;
  this.youWonTxt.x = 0;
  this.youWonTxt.y = -250;

  this.getReadyTxt = this.add.text(0, 25, "Get ready \n for the \n next level!");
  this.getReadyTxt.targetX = 0;
  this.getReadyTxt.targetY = 25;
  this.getReadyTxt.anchor.x = 0.5;
  this.getReadyTxt.anchor.y = 0;
  this.getReadyTxt.align = 'center';
  this.getReadyTxt.fill = '#ffffff';
  this.getReadyTxt.stroke = '#000000';
  this.getReadyTxt.strokeThickness = 5;

  this.getReadyTxt.alpha = 0;
  this.getReadyTxt.x = 0;
  this.getReadyTxt.y = 500;

  this.levelNameTxt = this.add.text(0,-75, "Level 0");
  this.levelNameTxt.anchor.setTo(0.5);
  this.levelNameTxt.align = 'center';
  this.levelNameTxt.fill = '#ffffff';
  this.levelNameTxt.stroke = '#000000';
  this.levelNameTxt.strokeThickness = 5;
  this.levelNameTxt.alpha = 0;

  this.uiGroup.add(this.youWonTxt);
  this.uiGroup.add(this.getReadyTxt);
  this.uiGroup.add(this.levelNameTxt);
}; 
Match3.GameState.exitMessage = function(){
  this.isBoardBlocked = true;
  if (this.exitMessagePopup) {
    this.exitMessagePopup.destroy();
  }
  this.exitMessagePopup = this.game.add.group();
  this.exitMessagePopup.x = 0;
  this.exitMessagePopup.y = 0;
  let background = this.game.add.sprite(0, 0, "cursor"),
      text = this.game.add.text(0, 0, "Do you want to Quit?");
  this.exitYesButton = this.game.add.button(0, 0, "back_button", this.exitToMainMenu, this);
  this.exitNoButton = this.game.add.button(0, 0, "back_button", this.hideBox, this);
  text.anchor.setTo(0.5, 1);
  text.wordWrap = true;
  text.wordWrapWidth = this.game.width;
  text.align = 'center';
  text.fill = '#ffffff';
  text.stroke = '#000000';
  text.strokeThickness = 5;
  this.exitMessagePopup.add(background);
  this.exitMessagePopup.add(this.exitYesButton);
  this.exitMessagePopup.add(this.exitNoButton);
  this.exitMessagePopup.add(text);
  this.uiGroup.add(this.exitMessagePopup);

  this.exitYesButton.anchor.setTo(0, 0.5);
  this.exitYesButton.y = 50;
  this.exitYesButton.x = 10;
  this.exitNoButton.anchor.setTo(1, 0.5);
  this.exitNoButton.y = 50;
  this.exitNoButton.x = -10;
  this.pauseGame();
}; 
Match3.GameState.deadMessage = function(){
  this.isBoardBlocked = true;
  if (this.deadMessagePopup) {
    this.deadMessagePopup.destroy();
  }
  this.fadeToDeadMessage();
  this.deadMessagePopup = this.game.add.group();
  this.deadMessagePopup.x = 0;
  this.deadMessagePopup.y = 0;
  let text = this.game.add.text(0, 0, "YOU DIED \n Retry?");
  this.deadYesButton = this.game.add.button(0, 0, "back_button", this.retryLevel, this);
  this.deadNoButton = this.game.add.button(0, 0, "back_button", this.exitToMainMenu, this);
  text.anchor.setTo(0.5, 1);
  text.wordWrap = true;
  text.wordWrapWidth = this.game.width;
  text.align = 'center';
  text.fill = '#ffffff';
  text.stroke = '#000000';
  text.strokeThickness = 5;
  
  this.deadMessagePopup.add(text);
  this.deadMessagePopup.add(this.deadYesButton);
  this.deadMessagePopup.add(this.deadNoButton);
  this.uiGroup.add(this.deadMessagePopup);

  this.deadYesButton.anchor.setTo(1, 0.5);
  this.deadYesButton.y = 50;
  this.deadYesButton.x = -10;

  this.deadNoButton.anchor.setTo(0, 0.5);
  this.deadNoButton.y = 50;
  this.deadNoButton.x = 10;
}; 
Match3.GameState.hideBox = function(event){
  if (this.exitMessagePopup) {
    this.exitMessagePopup.destroy();
  }
  if (this.deadMessagePopup) {
    this.deadMessagePopup.destroy();
  }
  this.isBoardBlocked = false;
};
Match3.GameState.exitToMainMenu = function(event){
  this.exitToMainMenuFadeOut();
};
Match3.GameState.retryLevel = function(event){
  this.hideBox();
  this.endLevel(true);
};
Match3.GameState.exitToMainMenuFadeOut = function(){
  this.hideBox();
  let blackFade = this.game.add.tween(this.black);
  blackFade.to({alpha: 1}, 2000, Phaser.Easing.Linear.Out, false);
  blackFade.onComplete.add(function(){
    this.state.start('Menu');
  }, this);
  blackFade.start();
};
Match3.GameState.fadeToDeadMessage = function(){
  let blackFade = this.game.add.tween(this.black);
  blackFade.to({alpha: 0.75}, 1000, Phaser.Easing.Linear.Out, false, 0);
  blackFade.start();
};