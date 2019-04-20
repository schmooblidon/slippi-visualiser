import Game from "./game";
import { setupLayers } from "./draw/draw";
import { setupControlsBox, setupControls } from "./controls";
import { stageExists } from "./stages/stages";
import { characterExists } from "./characters";
import { drawBackgroundInit, drawBackground } from "./draw/draw_stage";
import { drawLoading } from "./draw/draw_ui";

export let curGame = null;

export let displayDebug = false;

function isObj(obj) {
  return obj === Object(obj) && Object.prototype.toString.call(obj) !== '[object Array]';
}

export let compatible = true;
export let compatibilityText = ["",""];

function earlySetup() {
  $("#display").show();
  setupLayers();
  resize();
  drawBackgroundInit();
  drawBackground();
  drawLoading();
  resize();
}

function start (event){
  // if game is already playing, exit
  if (curGame != null) return;

  $("#loading_anim").fadeOut(200);
  resize();
  const slp_replay = event.data
  if (!isObj(slp_replay)) {
    compatible = false;
    compatibilityText = ["Invalid input"];
  } else if (!isCompatible(slp_replay)) {
    compatible = false;
  }

  curGame = new Game(slp_replay, compatible, compatibilityText);
  
  //setupControlsBox();
  if (compatible) {
    setupControls();
    $("#slider_container").show();
  }

  curGame.playback.start();
}

function isCompatible(slp_replay) {
  for (var i=0;i<slp_replay.settings.players.length;i++) {
    if (!characterExists(slp_replay.settings.players[i].characterId)) {
      // console.log("CHARACTER DOESN'T EXIST YET!");
      compatibilityText = ["Character not yet", "implemented"];
      return false;
    }
  }
  if (!stageExists(slp_replay.settings.stageId)) {
    // console.log("STAGE DOESN'T EXIST YET!");
    compatibilityText = ["Stage not yet", "implemented"];
    return false;
  }
  return true;
}

window.addEventListener('message', start);
window.earlySetup = earlySetup;
