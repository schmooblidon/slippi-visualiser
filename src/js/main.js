import Game from "./game";
import { setupLayers } from "./draw/draw";
import { setupFullscreenChange } from "./draw/fullscreen";
import { setupControlsBox } from "./draw/controls";

let game = new Game(slp_replay);

function start (){
  setupLayers();

  setupFullscreenChange();
  resize();
  setupControlsBox();

  game.playback.start();
}
window.start = start;