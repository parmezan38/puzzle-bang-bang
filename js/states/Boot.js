var Match3 = Match3 || {};
//setting game configuration and loading the assets for the loading screen
Match3.BootState = {
  init: function() {
    //Orientation 
    this.game.scale.forceOrientation(false, true);
    this.game.scale.enterIncorrectOrientation.add(function(){
      if(!this.game.device.desktop){
        // landscape
        document.getElementById("orientationTurn").style.display="block";
        this.game.paused = true;
        isPortrait = false;
      }
    }, this);
    this.game.scale.leaveIncorrectOrientation.add(function(){
      if(!this.game.device.desktop){
        document.getElementById("orientationTurn").style.display="none";
        this.game.paused = false;
        isPortrait = true;
      }
    }, this);

    // CANVAS only
    Phaser.Canvas.setSmoothingEnabled(this.game.context, false);
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas); // Ovo zapravo napravi da je crisp, al onda uništi pixele
    PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST; //for WebGL
    
    //loading screen will have a white background
    this.game.stage.backgroundColor = '#fff';
    this.game.stage.smoothed = false;
    this.game.renderer.renderSession.roundPixels = true;
    //have the game centered horizontally
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;   

    this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    this.scaleAll = 1;
    
    this.game.scale.setResizeCallback(function(){
      //Orientation 
      this.game.scale.forceOrientation(false, true);
      this.game.scale.enterIncorrectOrientation.add(function(){
        if(!this.game.device.desktop){
          // landscape
          document.getElementById("orientationTurn").style.display="block";
          this.game.paused = true;
          isPortrait = false;
        }
      }, this);
      this.game.scale.leaveIncorrectOrientation.add(function(){
        if(!this.game.device.desktop){
          document.getElementById("orientationTurn").style.display="none";
          this.game.paused = false;
          isPortrait = true;
        }
      }, this);
      if(this.game.scale.getParentBounds().width != newWidth * this.scaleAll || this.game.scale.getParentBounds().height != newHeight * this.scaleAll){
        this.scaleX = this.game.scale.getParentBounds().width / originalWidth;
        this.scaleY = this.game.scale.getParentBounds().height / originalHeight;
        this.scaleXFloor = Math.floor(this.scaleX);
        this.scaleYFloor = Math.floor(this.scaleY);
        this.scaleAll = this.scaleXFloor;
        this.remainderX =  (this.game.scale.getParentBounds().width / originalWidth ) - Math.floor(this.game.scale.getParentBounds().width / originalWidth);
        this.remainderY =  (this.game.scale.getParentBounds().height / originalHeight ) - Math.floor(this.game.scale.getParentBounds().height / originalHeight);
        if(this.scaleXFloor && this.scaleYFloor){
          if (this.remainderX > 0.75){
            this.scaleXFloor++;
          }
          if (this.remainderY > 0.75){
            this.scaleYFloor++;
          }
          if(this.scaleXFloor > this.scaleYFloor){
            this.scaleAll = this.scaleYFloor;
          } else {
            this.scaleAll = this.scaleXFloor;
          }
        }
        newWidth = Math.floor(this.game.scale.getParentBounds().width / this.scaleAll);
        newHeight = Math.floor(this.game.scale.getParentBounds().height / this.scaleAll);
        this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        this.game.scale.setUserScale(this.scaleAll, this.scaleAll);
        this.game.scale.setGameSize(newWidth, newHeight);
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;      
      }
    }, this);        
  },
  preload: function() {  
    this.load.image('bar', 'assets/images/preloader-bar.png');
  },
  
  create: function() {
    this.game.world.setBounds(0, 0, 1920, 1920);
    this.state.start('Preload');
  }
};