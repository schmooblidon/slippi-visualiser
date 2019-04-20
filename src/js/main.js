import Game from "./game";
import { setupLayers } from "./draw/draw";
import { setupControlsBox, setupControls } from "./controls";
import { stageExists } from "./stages/stages";
import { characterExists } from "./characters";

export let curGame = null;

export let displayDebug = false;

function isObj(obj) {
  return obj === Object(obj) && Object.prototype.toString.call(obj) !== '[object Array]';
}

function start(event){
  const slp_replay = event.data
  if (!isObj(slp_replay)) {
    return;
  }

  if (!isCompatible(slp_replay)) {
    return;
  }

  curGame = new Game(slp_replay);

  setupLayers();
  resize();
  //setupControlsBox();
  setupControls();

  curGame.playback.start();
}

function isCompatible(slp_replay) {
  for (var i=0;i<slp_replay.settings.players.length;i++) {
    if (!characterExists(slp_replay.settings.players[i].characterId)) {
      console.log("CHARACTER DOESN'T EXIST YET!");
      return false;
    }
  }
  if (!stageExists(slp_replay.settings.stageId)) {
    console.log("STAGE DOESN'T EXIST YET!");
    return false;
  }
  return true;
}

window.addEventListener('message', start);