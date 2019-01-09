var Match3 = Match3 || {};

Match3.GameState = {
  init: function(passedArguments) {
    this.level = passedArguments.nextLevel;
    this.nextLevel = this.level + 1;
    this.nextTutorial = 0;
    // Offsets
    this.blocksGap = 0;
    this.blocksGapMax = 4;
    this.blocksOffsetY = 16;
    this.blocksOffsetYMax = 38;
    this.blocksOffsetYMin = 16;
    this.enemiesGap = 0;
    this.enemiesGapMax = 10;
    this.enemiesOffsetY = 0;
    this.enemiesOffsetYMax = 32;
    this.NUM_ROWS = 5;
    this.NUM_COLS = 6;
    this.NUM_VARIATIONS = 6;
    this.BLOCK_SIZE = 25;
    this.BLOCK_SPRITE_SIZE = 1;
    this.ANIMATION_TIME = 200;
    this.CENTER_POINT = {x: this.game.width/2, y: this.game.height/2};
    this.BOARD_SIZE = {w: (this.BLOCK_SIZE + this.blocksGap) * this.NUM_COLS, h: (this.BLOCK_SIZE + this.blocksGap) * this.NUM_ROWS};
    this.BOARD_POS = {x: -(this.BOARD_SIZE.w / 2) + this.BLOCK_SIZE/2, y: this.BLOCK_SIZE/2 + this.blocksOffsetY};

    // Revolver Consts
    this.REVOLVER_SLOTS = 6;
    this.RESERVE_SLOTS = 6;
    this.RESERVE_SLOTS_POS = {x: this.CENTER_POINT.x + 50, y:this.CENTER_POINT.y};
    this.REVOLVER_SLOTS_POS = {x: this.CENTER_POINT.x, y: this.CENTER_POINT.y};
    
    // Enemy Consts
    this.ENEMY_POS_ROWS = 3;
    this.ENEMY_POS_COLS = 5;
    this.ENEMY_BLOCK_SIZE = {w: 32 + this.enemiesGap, h: 45};
    this.ENEMIES_SIZE = {w: this.ENEMY_BLOCK_SIZE.w * this.ENEMY_POS_COLS, h: this.ENEMY_BLOCK_SIZE.h * this.ENEMY_POS_ROWS};

    this.BASE_DAMAGE = 10;
    this.enemyInfo = [
      {name: 'regular', asset: 'cowboy1', health: 10, damage: 1, shootDuration: 1, coverDuration: 3, preShootDuration: 2, postShootDuration: 1, shots: 1, hitChance: 50},
      {name: 'sniper', asset: 'sniper', health: 10, damage: 5, shootDuration: 1, coverDuration: 5, preShootDuration: 1, postShootDuration: 1, shots: 1, hitChance: 85},
      {name: 'turtle', asset: 'turtle', health: 20, damage: 1, shootDuration: 0.2, coverDuration: 3, preShootDuration: 1, postShootDuration: 1, shots: 12, hitChance: 25}
    ];
    this.coverInfo = [
      {name: 'wooden', asset: 'cover1', health: 10},
      {name: 'stone', asset: 'cover2', health: 50}
    ];
    this.WAVE_DELAY = 1000;
    this.gameMode = arguments[0];
    this.gameMode = "train";
    //this.level = 0;
    this.wave = 0;
    this.health = 20;
    this.maxHealth = 20;
    this.nukeFuel = 0;
    this.nukeFuelMax = 9;
    this.isDead = false;
    this.enemiesOnScreen = 0;
    this.isChainAddable = true;
    this.time4Nuke = 0;
    this.boardPositionGrid = [];
    // World
    this.worldGrid = [];
    this.canAddEnemies = true;
    
    this.firstHoverBlock;
    this.currentHoverBlock;
    this.firstHoverReserve;
    this.currentHoverReserve;
    // Za Debug, izbrisat u finalnoj verziji
    this.game.time.advancedTiming = true; 
  },
  create: function() {
    // JSON
    this.levelData = JSON.parse(this.game.cache.getText('levelData') );
    this.coverData = JSON.parse(this.game.cache.getText('coverData') );
    this.enemyPositions = JSON.parse(this.game.cache.getText('enemyPositions') );
    this.blockData = JSON.parse(this.game.cache.getText('blockData') );

    this.nextLevel = this.levelData.levelInfo[this.level].nextLevel;
    this.nextTutorial = this.levelData.levelInfo[this.level].nextTutorial;
    // Swipe
    this.game.input.onUp.add(this.endSwipe, this);
    // debug grid
    this.debuggrid = this.add.sprite(0, 0, 'debuggrid');
    // Background 
    this.background = this.add.sprite(0, 0, 'debuggrid');
    this.background.anchor.setTo(0.5);
    this.background.x = this.CENTER_POINT.x;
    this.background.y = this.CENTER_POINT.y;
    
    // Grupe
    // Revolver Group
    this.revolverGroup = this.add.group();
    this.revolverGroup.name = "revolverGroup";
    this.revolverGroup.x = 0;
    this.revolverGroup.y = 0;
    // Revolver Slots
    this.revolverSlots = this.add.group();
    this.revolverSlots.name = "revolverSlots";
    
    // Reserve Slots
    this.reserveSlots = this.add.group();
    this.reserveSlots.name = "reserveSlots";
    this.reserveSlots.inputEnableChildren = true;
    this.reserveSlots.onChildInputDown.add(this.reserveBulletOnDown, this);
    this.reserveSlots.onChildInputOver.add(this.reserveBulletOnOver, this);
    
    // Enemies Grupa
    this.enemies = this.add.group();
    this.enemies.name = "enemies";
    // Covers Grupa
    this.covers = this.add.group();
    this.covers.name = "covers";
    // Block Holder
    this.blockHolder = this.add.sprite(0, 0, 'blockHolder');
    this.blockHolder.name = "blockHolder";
    this.blockHolder.anchor.setTo(0.5);
    // Heart
    this.heart = this.add.sprite(0, 0, 'heart');
    this.heart.name = "heart";
    this.heart.anchor.setTo(0.5, 0);
    this.heart.x = this.BLOCK_SIZE * -1.75;
    this.heart.y = -12;
    this.heart.frame = 20;
    // Blocks
    this.blocks = this.add.group();
    this.blocks.name = "blocks";
    this.blocks.inputEnableChildren = true;
    this.blocks.onChildInputDown.add(this.blocksOnDown, this);
    this.blocks.onChildInputOver.add(this.blocksOnOver, this);
    
    // Glavna grupa za Revolver i Blocks
    this.revolverAndSmoke = this.add.group();
    this.revolverAndSmoke.x = this.CENTER_POINT.x;
    this.revolverAndSmoke.y = this.CENTER_POINT.y;

    this.foregroundGameElements = this.add.group();
    this.foregroundGameElements.x = this.CENTER_POINT.x;
    this.foregroundGameElements.y = this.CENTER_POINT.y;

    this.blocksAndTheirBackground = this.add.group();
    this.blocksAndTheirBackground.x = this.CENTER_POINT.x;
    this.blocksAndTheirBackground.y = this.CENTER_POINT.y;
    //board model
    this.board = new Match3.Board(this, this.NUM_ROWS, this.NUM_COLS, this.NUM_VARIATIONS);
    
    // revolver
    this.revolver = new Match3.Revolver(this, this.REVOLVER_SLOTS, this.RESERVE_SLOTS);
    
    this.drawBoard();
    this.drawReserveBullets();
    this.drawRevolverBullets();
    this.addSmokeEmitter();
    this.addSpritesToRevolver();
    this.createWorldGrid();
    // UI and stuff
    this.uiGroup = this.add.group();
    this.uiGroup.x = this.CENTER_POINT.x;
    this.uiGroup.y = this.CENTER_POINT.y;
    // Nuke Button
    this.nukeButton = this.add.sprite(0, 0, 'nukeButton');
    this.nukeButton.anchor.setTo(0, 1);
    this.nukeButton.inputEnabled=true;
    this.nukeButton.events.onInputDown.add(this.nukeBoardOnly,this);
    this.nukeButton.frame = this.nukeFuel;
    
    this.revolverGroup.add(this.revolverSlots);
    this.revolverAndSmoke.add(this.revolverGroup);
    this.foregroundGameElements.add(this.heart);
    this.foregroundGameElements.add(this.blockHolder);
    this.blocksAndTheirBackground.add(this.blocks);
    this.foregroundGameElements.add(this.reserveSlots);
    this.foregroundGameElements.add(this.nukeButton);
    this.addCovers();
    
    // Back Button
    this.backButton = this.add.sprite(0, 0, 'back_button');
    this.backButton.anchor.setTo(0);
    this.backButton.inputEnabled=true;
    this.backButton.events.onInputDown.add(this.exitMessage,this);
    
    this.nukeButton.x = -88;
    this.nukeButton.y = 20;
    
    // Textovi
    this.text1 = this.add.text(0, 80, "text text");
    this.text1.font = 'bold 2pt Arial'
    this.text2 = this.add.text(0, 100, "text text");
    this.text2.font = 'bold 2pt Arial'
    this.text3 = this.add.text(0, 120, "text text");
    this.text3.font = 'bold 2pt Arial'
    
    // Black For Fade
    this.black = this.add.sprite(0, 0, 'black');
    this.black.anchor.setTo(0.5);
    this.black.scale.setTo(3);
    this.black.alpha = 1;
    this.uiGroup.add(this.black);
    // unpause funkcija
    this.game.input.onDown.add(this.unpauseGame, this);
    
    this.createEndLevelTexts();
    
    this.fadeToLevelStart();
    this.calculateOffsets();

    this.cursorA = this.add.sprite(0, 0, 'cursorA');
    this.cursorA.anchor.setTo(0);
    this.cursorB = this.add.sprite(this.game.width, this.game.height, 'cursorB');
    this.cursorB.anchor.setTo(1);

    this.game.scale.onSizeChange.add(function(){
      this.calculateOffsets();
    }, this);
  },
  update: function(){
    this.scaleFactorNum = this.scale.scaleFactorInversed;
    this.text1.setText(this.game.width);
    this.text2.setText(this.game.height);
    this.text3.setText(this.scaleFactorNum.x);

    this.refreshPositions();
    this.time4Nuke++;
    if(this.time4Nuke > this.game.time.fps * 4){
      if(this.nukeFuel < this.nukeFuelMax - 1){
        this.nukeFuel++;
      }
      this.updateNukeSprite();
      this.time4Nuke = 0;
    }
    this.cursorA.x = 0;
    this.cursorA.y = 0;
    this.cursorB.x = this.game.width;
    this.cursorB.y = this.game.height;
  },
  calculateOffsets: function(){
    this.CENTER_POINT.x = this.game.width/2;
    this.CENTER_POINT.y = this.game.height/2;
    console.log("calculateOffsets");
    // Enemy Width Gap Calculate,
    let i = 0;
    while (i < 20){
      if (this.ENEMIES_SIZE.w > this.game.width){
        this.enemiesGap--;
        this.ENEMY_BLOCK_SIZE.w = 32 + this.enemiesGap;
        this.ENEMIES_SIZE.w = this.ENEMY_BLOCK_SIZE.w * this.ENEMY_POS_COLS;
      } 
      else if (this.ENEMIES_SIZE.w < this.game.width - 1 && this.enemiesGap < this.enemiesGapMax){
        this.enemiesGap++;
        this.ENEMY_BLOCK_SIZE.w = 32 + this.enemiesGap;
        this.ENEMIES_SIZE.w = this.ENEMY_BLOCK_SIZE.w * this.ENEMY_POS_COLS;
      }
      else {
        i = 99;
      }
      i++;
    }
    this.updateWorldPositions();
    this.updateEnemyPositions();
    // Enemy Y Offset
    let j = 0;
    while (j < 20){
      let heightRemainder = (this.game.height / 2) - this.ENEMIES_SIZE.h;
      if (this.ENEMIES_SIZE.h + this.enemiesOffsetY < this.game.height / 2){
        if (this.enemiesOffsetY < heightRemainder/2 && this.enemiesOffsetY < this.enemiesOffsetYMax){
          this.enemiesOffsetY++;
        }
      }
      else if (this.ENEMIES_SIZE.h + this.enemiesOffsetY > this.game.height / 2 || this.enemiesOffsetY > this.enemiesOffsetYMax){
        if(this.enemiesOffsetY > 0){
          this.enemiesOffsetY--;
        }
      }
      else {
        j = 99;
      }
      j++;
    }
    this.updateWorldPositions();
    this.updateEnemyPositions();
    // Blocks Gap Calculate
    let k = 0;
    while (k < 20){
      // Gap
      if(this.BOARD_SIZE.w < this.game.width && (this.BOARD_SIZE.h + this.blocksOffsetY) < (this.game.height/2) - this.blocksOffsetYMin) {
        if(this.blocksGap < this.blocksGapMax && this.CENTER_POINT.y + this.BOARD_SIZE.h + this.blocksOffsetY < this.game.height){
          this.blocksGap++;
          this.BOARD_SIZE.w = (this.BLOCK_SIZE + this.blocksGap) * this.NUM_COLS;
          this.BOARD_SIZE.h = (this.BLOCK_SIZE + this.blocksGap) * this.NUM_ROWS;
        }
      }
      else if( (this.BOARD_SIZE.w > this.game.width || this.CENTER_POINT.y + this.BOARD_SIZE.h + this.blocksOffsetY > this.game.height) && this.blocksGap >= 0){
        if(this.blocksGap > 0){
          this.blocksGap--;
        }
        this.BOARD_SIZE.w = (this.BLOCK_SIZE + this.blocksGap) * this.NUM_COLS;
        this.BOARD_SIZE.h = (this.BLOCK_SIZE + this.blocksGap) * this.NUM_ROWS;
      }
      else {
        this.BOARD_SIZE.w = (this.BLOCK_SIZE + this.blocksGap) * this.NUM_COLS;
        this.BOARD_SIZE.h = (this.BLOCK_SIZE + this.blocksGap) * this.NUM_ROWS; 
        k = 99;
      }
      this.BOARD_POS.x = -(this.BOARD_SIZE.w / 2) + this.BLOCK_SIZE/2;
      this.BOARD_POS.y = this.BLOCK_SIZE/2 + this.blocksOffsetY;
      k++;
    }
    let h = 0;
    while (h < 20){
      // Y Offset
      let heightRemainder = ((this.game.height / 2) - this.BOARD_SIZE.h) - this.blocksOffsetYMin;
      console.log("boardsize.y: " + (this.BOARD_SIZE.h + this.blocksOffsetY) + "  game.w: " + this.game.width);
      if(this.BOARD_SIZE.h + this.blocksOffsetY > this.game.height/2){
        if(this.blocksOffsetY > this.blocksOffsetYMin){
          console.log("AJAJA");
          this.blocksOffsetY--;
        }
        this.BOARD_POS.y = this.BLOCK_SIZE/2 + this.blocksOffsetY;
      }
      else {
        if(this.blocksOffsetY < this.blocksOffsetYMax && (this.blocksOffsetY - this.blocksOffsetYMin) < heightRemainder/2 ){
          this.blocksOffsetY++;
        }
        this.BOARD_POS.y = this.BLOCK_SIZE/2 + this.blocksOffsetY;
      }
      this.BOARD_POS.y = this.BLOCK_SIZE/2 + this.blocksOffsetY;
      h++;
    }
    this.updateBlockPositions();
    console.log(this.blocksOffsetY);
    // Front Elements Reposition
    if(this.game.width > 220){
      this.nukeButton.x = -110;
    }
    else {
      this.nukeButton.x = -this.game.width/2;
    }

    if(this.blocksOffsetY < 23){
      this.foregroundGameElements.y = this.CENTER_POINT.y - (23 - this.blocksOffsetY)
    }
    else {
      this.foregroundGameElements.y = this.CENTER_POINT.y;
    }
  },
  updateEnemyPositions: function(){
    this.enemies.forEach(function(child){
      child.updatePosition();
    }, this);
    this.covers.forEach(function(child){
      child.updatePosition();
    }, this);
  },
  addNewWaveIfCan: function(){
    // Check Number of Enemies Alive
    if(this.enemiesOnScreen === 0){
      if(this.canAddEnemies){
        this.wave++;
        if(this.wave < this.enemyPositions.levelInfo[this.level].length){
          // Ako nije zadnji wave, Spawn Enemies
          if (this.canAddEnemies){
            this.canAddEnemies = false;
            this.startAddingEnemies();
          }
        } else {
          // AKo je zadnji wave, End Level
          if( (this.level + 1) < this.enemyPositions.levelInfo.length){
            this.endLevel(false);   
          }
          else {
            this.fadeToEndGame();
          }
        }
      }
    }
  },
  refreshPositions: function(){
    this.CENTER_POINT = {x: this.game.width/2, y: this.game.height/2};
    this.revolverAndSmoke.x = this.CENTER_POINT.x;
    this.revolverAndSmoke.y = this.CENTER_POINT.y;
    this.foregroundGameElements.x = this.CENTER_POINT.x;
    //this.foregroundGameElements.y = this.CENTER_POINT.y;
    this.blocksAndTheirBackground.x = this.CENTER_POINT.x;
    this.blocksAndTheirBackground.y = this.CENTER_POINT.y;
    
    this.background.x = this.CENTER_POINT.x;
    this.background.y = this.CENTER_POINT.y;
    
    this.enemies.x = this.CENTER_POINT.x - (this.ENEMIES_SIZE.w / 2);
    this.enemies.y = (this.CENTER_POINT.y - (this.ENEMIES_SIZE.h) ) - this.enemiesOffsetY;
    
    this.covers.x = this.CENTER_POINT.x - (this.ENEMIES_SIZE.w / 2);
    this.covers.y = (this.CENTER_POINT.y - (this.ENEMIES_SIZE.h) ) - this.enemiesOffsetY;
    
    this.backButton.x = 0;
    this.backButton.y = 0;
    this.uiGroup.x = this.CENTER_POINT.x;
    this.uiGroup.y = this.CENTER_POINT.y;
  },
  // SHOOT N NUKE
  nuke: function(){   
    // exactly iste stvari ka i na početku
    this.blocks.removeAll(true);
    this.board.populateGrid();
    this.board.populateReserveGrid();
    this.drawBoard();
    this.revolver.clearBullets();
    this.updateRevolverSprites(); 
    this.updateReserveSprites();
    this.nukeFuel = 0;
    this.updateNukeSprite();
  },
  nukeBoardOnly: function(){  
    if (this.nukeFuel >= this.nukeFuelMax - 1){
      this.nukeFuel = 0;
      this.time4Nuke = 0;
      this.blocks.removeAll(true);
      this.board.populateGrid();
      this.board.populateReserveGrid();
      this.drawBoard();
    }
    this.updateNukeSprite();
  },
  shoot: function(enemy){
    let i,
        temp=0;
    // Shoot, Efekt, Discardanje Barrela i Loadanje Barella
    if (!this.isBoardBlocked){
      if(this.revolver.revolverSlots[0].variation != 0){
        this.startSmokeEmitter();
        this.isBoardBlocked = true;
        // Oduzimanje Healtha
        this.bulletDamage(enemy, this.BASE_DAMAGE * this.revolver.revolverSlots[0].multiplier, this.revolver.revolverSlots[0].variation, this.revolver.revolverSlots[0].multiplier);
        this.camera.shake(0.1, 150, true, Phaser.Camera.SHAKE_VERTICAL, true);
        this.camera.flash(0xffffff, 200);
        this.recoilRevolver();
        this.rotateRevolver();
      } else {
        // check if any slots aren't empty
        for(i=0; i < this.revolver.revolverSlots.length; i++){
          if(this.revolver.revolverSlots[i].variation != 0){
            temp = i;
          }
        }
        // if not empty, then rotate until non-empty is barreled
        if (temp){
          if(!this.isBoardBlocked){
            this.rotateRevolverToFullSlot();    
          }
        }
      } // else end
    }
  }, // SHOOT N NUKE END
  damagePlayer: function(damage){
    this.damageDelay = this.game.time.create(false);
    this.damageDelay.add(50, function(){
      this.health -= damage;
      this.camera.flash(0xff1111, 150 + (100 * (damage/2) ) );
      this.camera.shake(0.03 + (damage/100), 150 + (100 * (damage/2) ), true, Phaser.Camera.SHAKE_BOTH, true);
      if(this.health <= 0){
        if(!this.isDead){
          this.killPlayer();
        } else {
          this.health = 0;
        }
      }
      this.updateHeartSprite();
    }, this, false);
    this.damageDelay.start();
  },
  revivePlayer: function(){
    this.health = this.maxHealth;  
    this.isDead = false;
    this.updateHeartSprite();
  },
  killPlayer: function(){
    this.isDead = true;
    this.deadMessage();  
  },
  healPlayer: function(heal){
    if(this.health + heal < this.maxHealth){
      this.health += heal;
    } else {
      this.health = this.maxHealth;
    }
    this.updateHeartSprite();
  },
  updateHeartSprite: function(){
    this.heart.frame = this.health;
  },
  updateNukeSprite: function(){
    this.nukeButton.frame = this.nukeFuel;
  },
  endLevel: function(isRetry){
    if (!isRetry){
      this.youWonTxt.alpha = 1;
      this.getReadyTxt.alpha = 1;
      let youWonTxtMovement = this.game.add.tween(this.youWonTxt);
      youWonTxtMovement.to({y: this.youWonTxt.targetY}, 750, Phaser.Easing.Bounce.Out);
      youWonTxtMovement.onComplete.add(function(){
        // Get ready text se bounca
        let getReadyTxtMovement = this.game.add.tween(this.getReadyTxt);
        getReadyTxtMovement.to({y: this.getReadyTxt.targetY}, 1000, Phaser.Easing.Bounce.Out, false, 0);
        getReadyTxtMovement.onComplete.add(function(){ 
          this.fadeToLevelEnd(isRetry); 
        }, this);
        getReadyTxtMovement.start();
      }, this);
      youWonTxtMovement.start();
    } else {
      this.fadeToLevelEnd(isRetry); 
    }
  },
  fadeToLevelEnd: function(isRetry){
    let blackFade = this.game.add.tween(this.black);
    blackFade.to({alpha: 1}, 1000, Phaser.Easing.Linear.Out, false, 0);
    blackFade.onComplete.add(function(){
      // Win and Ready Texts Fade Out
      let youWonTxtMovement = this.game.add.tween(this.youWonTxt),
          getReadyTxtMovement = this.game.add.tween(this.getReadyTxt);
      youWonTxtMovement.to({alpha: 0}, 750, Phaser.Easing.Linear.None);
      getReadyTxtMovement.to({alpha: 0}, 750, Phaser.Easing.Linear.None);
      youWonTxtMovement.start();
      
      getReadyTxtMovement.onComplete.add(function(){
          this.startNewLevel(isRetry);
      }, this);
      getReadyTxtMovement.start();
    }, this);

    blackFade.start();
  },
  fadeToEndGame: function(){
    let blackFade = this.game.add.tween(this.black);
    blackFade.to({alpha: 1}, 5000, Phaser.Easing.Linear.Out, false, 0);
    blackFade.onComplete.add(function(){
      this.state.start('End', true, false);
    }, this);
    blackFade.start();
  },
  fadeToLevelStart: function(){
    let textFadeTime = 1000,
        levelNameTxtFadeIn = this.game.add.tween(this.levelNameTxt);
    this.levelNameTxt.setText("Level " + (this.level + 1) );
    this.changeBackground();
    levelNameTxtFadeIn.to({alpha: 1}, textFadeTime, Phaser.Easing.Linear.Out, false, 0);
    levelNameTxtFadeIn.onComplete.add(function(){
      // Fade LEVEL TEXT Out
      let levelNameTxtFadeOut = this.game.add.tween(this.levelNameTxt);
      levelNameTxtFadeOut.to({alpha: 0}, textFadeTime, Phaser.Easing.Linear.Out, false, 0);
      levelNameTxtFadeOut.start();
    }, this);
    levelNameTxtFadeIn.start();
    /// Fade BLACK Out
    let blackFade = this.game.add.tween(this.black);
    blackFade.to({alpha: 0}, 1000, Phaser.Easing.Linear.Out, false, textFadeTime * 1.5);
    blackFade.onComplete.add(function(){
    this.canAddEnemies = true;
        this.runLevel();
      }, this);
    blackFade.start();  
  },
  runLevel: function(){
    if (this.canAddEnemies){
      this.canAddEnemies = false;
      this.startAddingEnemies();
    }
    this.isBoardBlocked = false;
  },
  startNewLevel: function(isRetry){
    if(isRetry){
      let passedArguments = {"nextLevel": this.level, "nextTutorial": 0};
      this.state.start('Game', true, false, passedArguments);  
    }
    else {
      if(this.nextTutorial != 0){
        let passedArguments = {"nextLevel": this.nextLevel, "nextTutorial": this.nextTutorial};
        this.state.start('Tutorial', true, false, passedArguments); 
      }
      else {
        let passedArguments = {"nextLevel": this.nextLevel, "nextTutorial": 0};
        this.state.start('Game', true, false, passedArguments); 
      }
    }
  },
  changeBackground: function(){
    this.background.loadTexture('background' + (this.level + 1));  
  },
  pauseGame: function(){
    this.game.paused = true;    
  },
  unpauseGame: function(event){
    if(isPortrait){
      if (this.game.paused){
        if(this.exitYesButton && this.exitNoButton){
          if (this.exitYesButton.getBounds().contains(this.game.input.x, this.game.input.y)) {
            this.game.paused = false;
            this.exitToMainMenu();
          }
          else if (this.exitNoButton.getBounds().contains(this.game.input.x, this.game.input.y)) {
            this.game.paused = false;   
            this.hideBox();
          }
        }
      } else {
        this.game.paused = false;  
      }
    }
  },
  // Swipe stuff
  endSwipe: function(){
    if(!this.isBoardBlocked){
      // ako je BLOCK
      if(this.firstHoverBlock && this.currentHoverBlock && this.firstHoverBlock != this.currentHoverBlock){
        this.pickBlock(this.currentHoverBlock);    
      }
      if(this.firstHoverReserve && this.currentHoverReserve && this.firstHoverReserve != this.currentHoverReserve){
        this.pickReserveBullet(this.currentHoverReserve);    
      }
    }
  },
  blocksOnDown: function(block){
    if(!this.isBoardBlocked){
      this.firstHoverBlock = block;
      this.pickBlock(this.firstHoverBlock);
    }
  },
  blocksOnOver: function(block){
    if(!this.isBoardBlocked){
      if(!this.currentHoverBlock && this.currentHoverBlock != this.firstHoverBlock){
        this.currentHoverBlock = block;    
      }
      if(block == this.firstHoverBlock){
        this.currentHoverBlock = block;    
      }
    }
  },
  reserveBulletOnDown: function(bullet){
    this.firstHoverReserve = bullet;
    this.pickReserveBullet(this.firstHoverReserve);
  },
  reserveBulletOnOver: function(bullet){
    this.currentHoverReserve = bullet;
  }
};
