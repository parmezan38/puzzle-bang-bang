var PuzzleBang = PuzzleBang || {};

//loading the game assets
PuzzleBang.PreloadState = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'bar');
    this.preloadBar.anchor.setTo(0.5);
    this.preloadBar.scale.setTo(100, 1);
    this.load.setPreloadSprite(this.preloadBar);

    //load game assets
    this.load.spritesheet('heart', 'assets/images/heart.png', 38, 36, 21);
    this.load.spritesheet('nukeButton', 'assets/images/nukeButton.png', 23, 18, 9);
      
    this.load.spritesheet('block1', 'assets/images/block1.png', 25, 25, 2);
    this.load.spritesheet('block2', 'assets/images/block2.png', 25, 25, 2);
    this.load.spritesheet('block3', 'assets/images/block3.png', 25, 25, 2);
    this.load.spritesheet('block4', 'assets/images/block4.png', 25, 25, 2);
    this.load.spritesheet('block5', 'assets/images/block5.png', 25, 25, 2);
    this.load.spritesheet('block6', 'assets/images/block6.png', 25, 25, 2);
    
    this.load.image('bullet0', 'assets/images/bullet0.png');
    this.load.spritesheet('bullet2', 'assets/images/bullet2.png', 12, 12, 6);
    this.load.spritesheet('bullet3', 'assets/images/bullet3.png', 12, 12, 6);
    this.load.spritesheet('bullet4', 'assets/images/bullet4.png', 12, 12, 6);
    this.load.spritesheet('bullet5', 'assets/images/bullet5.png', 12, 12, 6);
    this.load.spritesheet('bullet6', 'assets/images/bullet6.png', 12, 12, 6);
    // Particles
    this.load.image('damageParticle2', 'assets/images/damageParticle2.png');
    this.load.image('damageParticle3', 'assets/images/damageParticle3.png');
    this.load.image('damageParticle4', 'assets/images/damageParticle4.png');  
    this.load.image('damageParticle5', 'assets/images/damageParticle5.png');  
    this.load.image('damageParticle6', 'assets/images/damageParticle6.png');  
    this.load.image('deadBlock', 'assets/images/deadBlock.png');
    this.load.image('pxl2x', 'assets/images/pxl2x.png');
    this.load.image('pxl3x_red', 'assets/images/pxl3x_red.png');
    this.load.image('pxl3x_grey', 'assets/images/pxl3x_grey.png');
    this.load.image('pxl5x_grey', 'assets/images/pxl5x_grey.png');
    this.load.image('pxl9x_grey', 'assets/images/pxl9x_grey.png');
    this.load.image('pxl3x_white', 'assets/images/pxl3x_white.png');
    this.load.image('pxl2x_white', 'assets/images/pxl2x_white.png');
    // Enemies
    this.load.spritesheet('cowboy1', 'assets/images/cowboy01.png', 30, 45, 9);
    this.load.spritesheet('sniper', 'assets/images/sniper.png', 34, 48, 9);
    this.load.spritesheet('turtle', 'assets/images/turtle.png', 34, 48, 9);
      
    this.load.image('blockHolder', 'assets/images/block_holder.png');
    this.load.image('black', 'assets/images/black.png');
    this.load.image('back_button', 'assets/images/back_button.png');
    // Backgrounds
    this.load.image('background1', 'assets/images/background1.png');
    this.load.image('background2', 'assets/images/background2.png');
    
    this.load.spritesheet('cover1', 'assets/images/coverWooden.png', 34, 48, 6);
    this.load.image('cover2', 'assets/images/coverStone.png');
    this.load.image('revolver', 'assets/images/revolver.png');
    this.load.image('deadBlock', 'assets/images/bean_dead.png');
    this.load.image('debuggrid', 'assets/images/debuggrid.png'); 
    this.load.image('cursorA', 'assets/images/cursor12pxA.png');
    this.load.image('cursorB', 'assets/images/cursor12pxB.png'); 
    // Intro 
    this.load.image('sadHaircutLogo', 'assets/images/sadHaircutLogo.png');
    // load json data
    this.load.text('levelData', 'assets/data/levelData.json');
    this.load.text('coverData', 'assets/data/coverData.json');
    this.load.text('enemyPositions', 'assets/data/enemyPositions.json');
    this.load.text('blockData', 'assets/data/blockData.json');
    
    this.game.stage.smoothed = false;
  },
  create: function() {
    this.state.start('Menu');
  }
};