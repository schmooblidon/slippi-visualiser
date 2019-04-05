import { playerObject } from "./player/player";
import { renderPlayer } from "./draw/draw_player";
import { Vec2D } from "./utils/Vec2D";
import { drawBackground, drawStage, drawBackgroundInit, drawStageInit } from "./draw/draw_stage";
import { bg1, bg2, fg1, fg2, ui, setupLayers, setupFullscreenChange, setupElementInteractions, clearScreen } from "./draw/draw";
import { renderOverlay, lostStockQueue, percentShake, gameFinishScreen } from "./draw/draw_ui";
import { actions, specials } from "./actions";


const portNumbers = [0, 3, -1, -1];

// BUILD PLAYERS
export const CHARIDS = {
    MARTH_ID : 0,
    PUFF_ID : 1,
    FOX_ID : 2,
    FALCO_ID : 3,
    FALCON_ID : 4
};

export const CHARNAMES = {
  0 : "MARTH",
  1 : "PUFF",
  2 : "FOX",
  3 : "FALCO",
  4 : "FALCON"
};


export let player = [
  new playerObject(CHARIDS.FOX_ID, new Vec2D(0,0), 1),
  new playerObject(CHARIDS.MARTH_ID, new Vec2D(0,0), 1),
  0,
  0
];

export const playerAmount = 2;

let playing = false;

let currentFrameIdx = -123;
let currentFrame = 0;

export let startTimer = 2.05;

export let matchTimer = 480;

let finished = false;

let paused = false;

function finishGame() {
  finished = true;
  gameFinishScreen();
}

function restart() {
  currentFrameIdx = -123;
  paused = false;
  finished = false;
  playing = true;
}

function togglePause() {
  paused ^= true;
}

function frameForward() {
  paused = true;
  if (!finished) {
    currentFrameIdx++;
    updateState();
    renderState();
  }
}

function frameBackward() {
  paused = true;
  finished = false;
  currentFrameIdx = Math.max(-123, currentFrameIdx-1);
  updateState();
  renderState();
}

function gameTick (){
  setTimeout(gameTick, 16);
  if (!playing || finished || paused) return;
  currentFrameIdx++;
  updateState();
}

function renderTick () {
  window.requestAnimationFrame(renderTick);
  if (!playing || finished) return;
  renderState();
}

function renderState() {
  clearScreen();
  drawBackground();
  drawStage();
  for (var i = 0; i < playerAmount; i++) {
    renderPlayer(i);
  }
  renderOverlay(true, true);
}

function updateState() {
  if (currentFrameIdx < 0) {
    startTimer = Math.abs(currentFrameIdx) * 0.01666667;
    matchTimer = 480;
  }
  else {
    startTimer = 0;
    matchTimer = 480 - currentFrameIdx * 0.01666667;
  }

  if (matchTimer <= 0) { finishGame(); return; }

  currentFrame = game.frames[currentFrameIdx];

  if (currentFrame == null) { finishGame(); return ; }

  for (var i=0;i<playerAmount;i++) {
    var port = portNumbers[i];
    var state = currentFrame.players[port].post;

    if (player[i].stocks != state.stocksRemaining) lostStockQueue.push([i, state.stocksRemaining, 0]);
    if (player[i].percent != state.percent) percentShake(Math.abs(state.percent - player[i].percent)*8, i);

    player[i].stocks = state.stocksRemaining;
    //if (player[i].stocks <= 0) { finishGame(); return; }
    player[i].percent = state.percent;

    player[i].phys.pos.x = state.positionX;
    player[i].phys.pos.y = state.positionY;
    player[i].phys.face = state.facingDirection;
    var actionID = state.actionStateId;
    player[i].actionState = actions[actionID];
    player[i].timer = state.actionStateCounter;

    // THROWN STATES
    if (actionID >= 0x0F0 && actionID <= 0x0F3) {
      player[i].actionState = player[i].actionState.substr(0, 6) + CHARNAMES[player[1-i].charID] + player[i].actionState.substr(6,10);
    }

    // SHIELD ON STATES
    if (actionID >= 0x0B2 && actionID <= 0x0B3) {
      player[i].phys.shielding = true;
      player[i].phys.shieldAnalog = 1;
      player[i].phys.shieldPositionReal = new Vec2D(player[i].phys.pos.x + 0, player[i].phys.pos.y + 10);
      player[i].phys.shieldSize = (state.shieldSize / 60) * 7.7696875;
    }
    else {
      player[i].phys.shielding = false;
    }

    //SPECIALS
    if (actionID >= 341 && actionID <= 372) {
      player[i].actionState = specials[CHARNAMES[player[i].charID]][actionID];
    }

    //DEAD
    player[i].dead = (actionID >= 0x000 && actionID <= 0x003);

  }
}

// arrows only detect on keydown
$(document).keydown(function(e) {
  // RIGHT
  if (e.which == 39) {
    frameForward();
  }
  // LEFT
  if (e.which == 37) {
    frameBackward();
  }
});

$(document).keypress(function(e) {
  console.log(e.which);
  // ENTER
  if (e.which == 13) {
    togglePause();
  }
  // D
  if (e.which == 68 || e.which == 100) {
    frameForward();
  }
  // A
  if (e.which == 65 || e.which == 97) {
    frameBackward();
  }
  // R
  if (e.which == 82 || e.which == 114) {
    restart();
  }
});

function start (){
  for (var i=0;i<playerAmount;i++){
    player[i].phys.face = 1;
    player[i].actionState = "WAIT";
  }
  setupLayers();

  setupFullscreenChange();
  resize();
  setupElementInteractions();

  drawBackgroundInit();
  drawStageInit();

  gameTick();
  renderTick();

  restart();
}
window.start = start;