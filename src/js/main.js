import { playerObject } from "./player/player";
import { renderPlayer } from "./draw/draw_player";
import { Vec2D } from "./utils/Vec2D";
import { drawBackground, drawStage, drawBackgroundInit, drawStageInit } from "./draw/draw_stage";
import { setupLayers, setupFullscreenChange, setupElementInteractions, clearScreen } from "./draw/draw";
import { renderOverlay, lostStockQueue, percentShake, gameFinishScreen } from "./draw/draw_ui";
import { actions, specials } from "./actions";
import { externalCharacterIDs, characters } from "./characters/characters";
import { setVsStage } from "./stages/activeStage";
import { setInput } from "./input/input";

export let players = [
  null,null,null,null
];

export let playerAmount = 0;

function buildPlayers() {
  for (var i=0;i<game.settings.players.length;i++) {
    var p = game.settings.players[i];
    players[i] = new playerObject(p.playerIndex, p.port, p.characterId, p.characterColor, p.startStocks, p.type, p.teamId, p.nametag, new Vec2D(0,0), 1);
  }
  playerAmount = game.settings.players.length;
}

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

  if (showDebug) drawDebug();
}

let showDebug = false;

function drawDebug() {
  $("#currentFrame").text(currentFrameIdx.toString());
  for (var i=0;i<playerAmount;i++) {
    var p = players[i];
    var port = p.port;
    $("#p"+port+"_charname").text(p.charName);
    $("#p"+port+"_action_id").text(p.actionStateId);
    $("#p"+port+"_action_name").text(p.actionState);
    $("#p"+port+"_action_counter").text(p.actionStateCounter);

    $("#p"+port+"_input_lsX").text(p.input.lsX);
    $("#p"+port+"_input_lsY").text(p.input.lsY);
    $("#p"+port+"_input_l_trigger").text(p.input.lA);
    $("#p"+port+"_input_r_trigger").text(p.input.rA);
  }
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
    var p = players[i];
    var state = currentFrame.players[p.playerIndex].post;
    var input = currentFrame.players[p.playerIndex].pre;

    setInput(p, input);

    if (p.stocks != state.stocksRemaining) lostStockQueue.push([p.port - 1, state.stocksRemaining, 0]);
    if (p.percent != state.percent) percentShake(Math.abs(state.percent - p.percent)*8, i);

    p.stocks = state.stocksRemaining;
    //if (p.stocks <= 0) { finishGame(); return; }
    p.percent = state.percent;

    p.phys.pos.x = state.positionX;
    p.phys.pos.y = state.positionY;
    p.phys.face = state.facingDirection;
    var actionID = state.actionStateId;
    p.actionStateId = actionID;
    p.actionStateCounter = state.actionStateCounter;
    p.actionState = actions[actionID];

    // THROWN STATES
    if (actionID >= 0x0EF && actionID <= 0x0F3) {
      p.actionState = p.actionState.substr(0, 6) + externalCharacterIDs[p.charID] + p.actionState.substr(6,10);
    }

    // SHIELD ON STATES
    if (actionID >= 0x0B2 && actionID <= 0x0B6) {
      p.shield.active = true;
      p.shield.HP = state.shieldSize;
      p.shield.size = (p.shield.HP / 60) * 7.7696875;
      p.shield.stun = (actionID == 0x0B5) ? 1 : 0;
      p.shield.analog = Math.max(p.input.rA, p.input.lA);
      p.shield.positionReal = new Vec2D(0, 0);
      if (!p.shield.stun) {
        var x = p.input.lsX;
        var y = p.input.lsY;
        var offset = Math.sqrt(x * x + y * y) * 3;
        var angle = Math.atan2(y, x);
        p.shield.position =  new Vec2D(Math.cos(angle) * offset, Math.sin(angle) * offset);
      }
      p.shield.positionReal = new Vec2D(p.phys.pos.x + p.shield.position.x + (p.attributes.shieldOffset.x * p.phys.face / 4.5), p.phys.pos.y + p.shield.position.y + (p.attributes.shieldOffset.y / 4.5));
    }
    else {
      p.shield.active = false;
    }

    //SPECIALS
    if (actionID >= 341 && actionID <= 372) {
      p.actionState = specials[externalCharacterIDs[p.charID]][actionID];
    }

    //DEAD
    p.dead = (actionID >= 0x000 && actionID <= 0x003);

    //STARKO
    p.starKO = actionID == 0x004;

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
  // ENTER
  if (e.which == 13) {
    togglePause();
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
    restart();
  }
});

function start (){
  setupLayers();

  setupFullscreenChange();
  resize();
  setupElementInteractions();

  setVsStage(game.settings.stageId);
  buildPlayers();

  drawBackgroundInit();
  drawStageInit();

  gameTick();
  renderTick();

  restart();
}
window.start = start;