var Match3 = Match3 || {};
Match3.Tutorial = {
  init: function(passedArguments){
    this.nextLevel = passedArguments.nextLevel;
    this.tutorialNum = passedArguments.nextTutorial;
  },
  create: function() {
    this.CENTER_POINT = {x: this.game.width/2, y: this.game.height/2};
    // debug grid
    this.debuggrid = this.add.sprite(0, 0, 'debuggrid');
    // Buttons
    this.play1 = this.add.text(0, 0, "Continue");
    this.play1.anchor.setTo(1,1);
    this.play1.align = 'center';
    this.play1.fill = '#ffffff';
    this.play1.stroke = '#000000';
    this.play1.strokeThickness = 5;
    this.play1.inputEnabled = true;
    this.play1.events.onInputDown.add(this.exitToGame, this, 0, 'regular');
    this.play1.y = this.game.height - 5;
    this.play1.x = this.game.width - 5;
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
    this.play1.y = this.game.height - 5;
    this.play1.x = this.game.width - 5;
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
  exitToGameFadeOut: function(){
    let passedArguments = {"nextLevel": this.nextLevel, "nextTutorial": 0},
        blackFade = this.game.add.tween(this.black);
    blackFade.to({alpha: 1}, 1000, Phaser.Easing.Linear.Out, false);
    blackFade.onComplete.add(function(){
        this.state.start('Game', true, false, passedArguments);
    }, this);
    blackFade.start();
  }
};
