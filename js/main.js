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

var PuzzleBang = PuzzleBang || {};

PuzzleBang.game = new Phaser.Game(originalWidth, originalHeight, Phaser.CANVAS, this, true, false);

PuzzleBang.game.state.add('Boot', PuzzleBang.BootState);
PuzzleBang.game.state.add('Preload', PuzzleBang.PreloadState);
PuzzleBang.game.state.add('Intro', PuzzleBang.Intro);
PuzzleBang.game.state.add('Menu', PuzzleBang.Menu);
PuzzleBang.game.state.add('Game', PuzzleBang.GameState);
PuzzleBang.game.state.add('Tutorial', PuzzleBang.Tutorial);
PuzzleBang.game.state.add('End', PuzzleBang.End);
PuzzleBang.game.state.start('Boot');