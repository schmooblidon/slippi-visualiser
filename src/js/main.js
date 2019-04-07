import Game from "./game";
import { setupLayers } from "./draw/draw";
import { setupFullscreenChange } from "./draw/fullscreen";
import { setupControlsBox } from "./draw/controls";

export let curGame = new Game(slp_replay);
export let showDebug = false;

function start (){
  setupLayers();

  setupFullscreenChange();
  resize();
  setupControlsBox();

  curGame.playback.start();
}

window.start = start;

// arrows only detect on keydown
$(document).keydown(function(e) {
  // RIGHT
  if (e.which == 39) {
    curGame.playback.frameForward();
  }
  // LEFT
  if (e.which == 37) {
    curGame.playback.frameBackward();
  }
});

$(document).keypress(function(e) {
  // ENTER
  if (e.which == 13) {
    curGame.playback.togglePause();
  }
  // D
  if (e.which == 68 || e.which == 100) {
    showDebug ^= true;
    if (showDebug) {
      $("#debug").show();
    }
    else {
      $("#debug").hide();
    }
  }
  // R
  if (e.which == 82 || e.which == 114) {
    curGame.playback.restart();
  }
});