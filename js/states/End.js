var PuzzleBang = PuzzleBang || {};

PuzzleBang.End = {
  create: function() {
    this.CENTER_POINT = {x: this.game.width/2, y: this.game.height/2};
    // debug grid
    this.debuggrid = this.add.sprite(0, 0, 'debuggrid');
    // Buttons
    this.play1 = this.add.text(0, 0, "Normal Game");
    this.play1.anchor.setTo(0.5);
    this.play1.align = 'center';
    this.play1.fill = '#ffffff';
    this.play1.stroke = '#000000';
    this.play1.strokeThickness = 5;
    this.play1.inputEnabled = true;
    this.play1.events.onInputDown.add(this.exitToGame, this, 0, 'regular');
    
    this.play2 = this.add.text(0, 0, "Train Defense");
    this.play2.anchor.setTo(0.5);
    this.play2.align = 'center';
    this.play2.fill = '#ffffff';
    this.play2.stroke = '#000000';
    this.play2.strokeThickness = 5;
    this.play2.inputEnabled = true;
    this.play2.events.onInputDown.add(this.exitToGame, this, 0, 'train');
    
    this.options = this.add.text(0, 0, "Options");
    this.options.anchor.setTo(0.5);
    this.options.align = 'center';
    this.options.fill = '#ffffff';
    this.options.stroke = '#000000';
    this.options.strokeThickness = 5;
    this.options.inputEnabled = true;
    this.options.events.onInputDown.add(this.optionMessage, this);
    
    this.buttons = this.add.group();
    this.buttons.x = this.CENTER_POINT.x;
    this.buttons.y = this.CENTER_POINT.y;
    this.buttons.add(this.play1);
    this.buttons.add(this.play2);
    this.buttons.add(this.options);
    
    this.play1.y = -40;
    this.play2.y = 0;
    this.options.y = 40;
    
    // Black For Fade
    this.black = this.add.sprite(0, 0, 'black');
    this.black.anchor.setTo(0.5);
    this.black.scale.setTo(3);
    this.black.alpha = 1;
    
    this.fadeIn();
  },
  update: function(){
    this.refreshPositions();
  },
  refreshPositions: function(){
    this.CENTER_POINT = {x: this.game.width/2, y: this.game.height/2};
    this.buttons = this.add.group();
    this.buttons.x = this.CENTER_POINT.x;
    this.buttons.y = this.CENTER_POINT.y;
  },
  fadeIn: function(){
    let blackFade = this.game.add.tween(this.black);
    blackFade.to({alpha: 0}, 1000, Phaser.Easing.Linear.Out, false);
    blackFade.onComplete.add(function(){

    }, this);
    blackFade.start();
  },
  exitToGame: function(){
    this.exitToGameFadeOut(arguments[2]);
  },
  exitToGameFadeOut: function(gameMode){
    let blackFade = this.game.add.tween(this.black);
    blackFade.to({alpha: 1}, 1000, Phaser.Easing.Linear.Out, false);
    blackFade.onComplete.add(function(){
      this.state.start('Game', true, false, gameMode);
    }, this);
    blackFade.start();
  },
  optionMessage: function(){
    this.play1.inputEnabled = false;

    if (this.optionMessagePopup) {
      this.optionMessagePopup.destroy();
    }

    this.optionMessagePopup = this.game.add.group();
    this.optionMessagePopup.x = this.CENTER_POINT.x;
    this.optionMessagePopup.y = this.CENTER_POINT.y;

    let background = this.game.add.sprite(0, 0, "back_button"),
        text = this.game.add.text(0, 0, "Do you want to Quit?");
    this.yesButton = this.game.add.button(0, 0, "back_button", this.exitToMainMenu, this);
    this.noButton = this.game.add.button(0, 0, "back_button", this.hideBox, this);

    text.anchor.setTo(0.5, 1);
    text.wordWrap = true;
    text.wordWrapWidth = this.game.width;
    text.align = 'center';
    text.fill = '#ffffff';
    text.stroke = '#000000';
    text.strokeThickness = 5;

    this.optionMessagePopup.add(background);
    this.optionMessagePopup.add(this.yesButton);
    this.optionMessagePopup.add(this.noButton);
    this.optionMessagePopup.add(text);

    this.yesButton.anchor.setTo(0, 0.5);
    this.yesButton.y = 50;
    this.yesButton.x = 10;

    this.noButton.anchor.setTo(1, 0.5);
    this.noButton.y = 50;
    this.noButton.x = -10;
  },
  hideBox: function(event){
    this.optionMessagePopup.destroy();
  }
};
