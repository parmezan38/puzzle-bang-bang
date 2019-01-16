var PuzzleBang = PuzzleBang || {};

PuzzleBang.Intro = {
  create: function() {
    this.CENTER_POINT = {x: this.game.width/2, y: this.game.height/2};
    // debug grid
    this.backBlack = this.add.sprite(this.CENTER_POINT.x, this.CENTER_POINT.y, 'black');
    this.backBlack.anchor.setTo(0.5);
    this.backBlack.scale.setTo(3);
    // Black For Fade
    this.black = this.add.sprite(this.CENTER_POINT.x, this.CENTER_POINT.x, 'black');
    this.black.anchor.setTo(0.5);
    this.black.scale.setTo(3);
    this.black.alpha = 1;
    // Sad Haircut Games Logo
    this.sadHaircutLogo = this.add.sprite(this.CENTER_POINT.x, this.CENTER_POINT.y, 'sadHaircutLogo');
    this.sadHaircutLogo.anchor.setTo(0.5);
    this.sadHaircutLogo.alpha = 0;
    // Game Logo
    this.gameLogo = this.add.sprite(this.CENTER_POINT.x, this.CENTER_POINT.y, 'sadHaircutLogo');
    this.gameLogo.anchor.setTo(0.5);
    this.gameLogo.alpha = 0;
    
    this.fadeIn();
  },
  update: function(){
    this.refreshPositions();
  },
  refreshPositions: function(){
    this.CENTER_POINT = {x: this.game.width/2, y: this.game.height/2};
  },
  fadeIn: function(){
    let blackFade = this.game.add.tween(this.black);
    blackFade.to({alpha: 0}, 1000, Phaser.Easing.Linear.Out, false);
    blackFade.onComplete.add(function(){
        this.sadHaircutLogoFadeInOut();
    }, this);
    blackFade.start();
  },
  exitToGameFadeOut: function(gameMode){
    let blackFade = this.game.add.tween(this.black);
    blackFade.to({alpha: 1}, 1000, Phaser.Easing.Linear.Out, false);
    blackFade.onComplete.add(function(){
        this.state.start('Game', true, false);
    }, this);
    blackFade.start();
  },
  sadHaircutLogoFadeInOut(){
    let logoFadeIn = this.game.add.tween(this.sadHaircutLogo);
    logoFadeIn.to({alpha: 1}, 750, Phaser.Easing.Linear.Out, false);
    logoFadeIn.onComplete.add(function(){
      let logoFadeOut = this.game.add.tween(this.sadHaircutLogo);
      logoFadeOut.to({alpha: 0}, 750, Phaser.Easing.Linear.Out, false, 1500);
      logoFadeOut.onComplete.add(function(){
        this.gameLogoFadeInOut();
      }, this);
      logoFadeOut.start();
    }, this);
    logoFadeIn.start();
  },
  gameLogoFadeInOut(){
    let gameFadeIn = this.game.add.tween(this.gameLogo);
    gameFadeIn.to({alpha: 1}, 750, Phaser.Easing.Linear.Out, false, 750);
    gameFadeIn.onComplete.add(function(){
      let gameFadeOut = this.game.add.tween(this.sadHaircutLogo);
      gameFadeOut.to({alpha: 0}, 750, Phaser.Easing.Linear.Out, false, 2000);
      gameFadeOut.onComplete.add(function(){
        this.state.start('Menu', true, false);
      }, this);
      gameFadeOut.start();
    }, this);
    gameFadeIn.start();
  }
};
