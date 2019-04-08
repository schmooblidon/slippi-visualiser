import Game from "./game";
import { setupLayers } from "./draw/draw";
import { setupControlsBox, setupControls } from "./controls";

export let curGame = null;

export let displayDebug = false;

function start (slp_replay){
  curGame = new Game(slp_replay);

  setupLayers();
  resize();
  //setupControlsBox();
  setupControls();

  curGame.playback.start();
}

window.start = start;