import Game from "./game";
import { setupLayers } from "./draw/draw";
import { setupControlsBox, setupControls } from "./controls";
import { stageExists } from "./stages/stages";
import { characterExists } from "./characters";
import { drawBackgroundInit, drawBackground } from "./draw/draw_stage";
import { drawLoading } from "./draw/draw_ui";

export let curGame = null;

export let displayDebug = false;

export let compatible = true;
export let compatibilityText = ["",""];

function earlySetup() {
  $("#display").show();
  $("#slider_container").hide();
  setupLayers();
  resize();
  drawBackgroundInit();
  drawBackground();
  drawLoading();
  resize();
}

function start (slp_replay){
  $("#loading_anim").fadeOut(200);
  resize();
  if (!isCompatible(slp_replay)) {
    compatible = false;
  } 
  curGame = new Game(slp_replay, compatible, compatibilityText);
  
  //setupControlsBox();
  if (compatible) {
    $("#slider_container").show();
    setupControls();
  }

  curGame.playback.start();
}

function isCompatible(slp_replay) {
  for (var i=0;i<slp_replay.settings.players.length;i++) {
    if (!characterExists(slp_replay.settings.players[i].characterId)) {
      console.log("CHARACTER DOESN'T EXIST YET!");
      compatibilityText = ["Character not yet", "implemented!"];
      return false;
    }
  }
  if (!stageExists(slp_replay.settings.stageId)) {
    console.log("STAGE DOESN'T EXIST YET!");
    compatibilityText = ["Stage not yet", "implemented!"];
    return false;
  }
  return true;
}

window.start = start;
window.earlySetup = earlySetup;