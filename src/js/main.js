import Game from "./game";
import { setupLayers } from "./draw/draw";
import { setupControlsBox, setupControls } from "./controls";

export let curGame = new Game(slp_replay);

export let displayDebug = false;

function start (){

  curGame.playback.start();
}

window.start = start;

setupLayers();
resize();
setupControlsBox();
setupControls();