const originalWidth = 180;
const originalHeight = 320;
let newWidth = 180;
let newHeight = 320;
let isFullScreen = false;
let isPortrait = true;
let orientation = 0;

window.addEventListener('orientationchange', function(){
  orientation = window.screen.orientation;
  gameRatio = window.innerWidth/window.innerHeight;
  console.log(gameRatio);
} , false);

var Match3 = Match3 || {};

Match3.game = new Phaser.Game(originalWidth, originalHeight, Phaser.CANVAS, this, true, false);

Match3.game.state.add('Boot', Match3.BootState);
Match3.game.state.add('Preload', Match3.PreloadState);
Match3.game.state.add('Intro', Match3.Intro);
Match3.game.state.add('Menu', Match3.Menu);
Match3.game.state.add('Game', Match3.GameState);
Match3.game.state.add('Tutorial', Match3.Tutorial);
Match3.game.state.add('End', Match3.End);
Match3.game.state.start('Boot');