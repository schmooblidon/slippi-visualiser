import Playback from "./playback";
import Player from "./player";
import { getStage } from "./stages/stages";
import Vec2D from "./utils/Vec2D";
import { clearScreen } from "./draw/draw";
import { drawPlayer } from "./draw/draw_player";
import { drawGameFinishScreen, drawOverlay, lostStockQueue, percentShake } from "./draw/draw_ui";
import { drawBackground, drawStage } from "./draw/draw_stage";
import { showDebug, drawDebug } from "./draw/debug";

export default function Game(replay) {

  this.replay = replay;
  this.playback = new Playback(this);
  this.currentFrame = 0;
  this.currentFrameIdx = -123;

  this.stage = getStage(this.replay.settings.stageId);
  this.stageId = this.replay.settings.stageId;

  this.players = [];
  // build players
  for (var i=0;i<this.replay.settings.players.length;i++) {
  var p = this.replay.settings.players[i];
    this.players[i] = new Player(p.playerIndex, p.port, p.characterId, p.characterColor, p.startStocks, p.type, p.teamId, p.nametag, new Vec2D(0,0), 1);
  }
  this.playerAmount = this.replay.settings.players.length;

  this.startTimer = 2.05;
  this.matchTimer = 480;

  this.finishGame = function() {
    this.finished = true;
    drawGameFinishScreen(this);
  }

  this.renderState = function() {
    clearScreen();
    drawBackground();
    drawStage(this.stage);
    for (var i = 0; i < this.playerAmount; i++) {
      drawPlayer(this.players[i], this.stage);
    }
    drawOverlay(this, true, true);

    if (showDebug) drawDebug(this.currentFrameIdx);
  }

  this.updateState = function() {

    // start timer ticks from frame -123 to 0
    if (this.currentFrameIdx < 0) {
      this.startTimer = Math.abs(this.currentFrameIdx) * 0.01666667;
      this.matchTimer = 480;
    }
    // from frame 0 onward the match timer will tick down
    else {
      this.startTimer = 0;
      this.matchTimer = 480 - this.currentFrameIdx * 0.01666667;
    }

    if (this.matchTimer <= 0) { this.finishGame(); return; }

    this.currentFrame = this.replay.frames[this.currentFrameIdx];

    if (this.currentFrame == null) { this.finishGame(); return ; }

    var prevFrame = this.replay.frames[Math.max(-123, this.currentFrameIdx-1)];

    for (var i=0;i<this.playerAmount;i++) {
      var p = this.players[i];
      var state = this.currentFrame.players[p.playerIndex].post;
      var prevState = prevFrame.players[p.playerIndex].post;
      var slp_input = this.currentFrame.players[p.playerIndex].pre;

      p.input.setInput(slp_input);

      if (p.stocks != state.stocksRemaining) lostStockQueue.push([p.port - 1, state.stocksRemaining, 0]);
      if (p.percent != state.percent) percentShake(Math.abs(state.percent - p.percent)*8, i);

      p.stocks = state.stocksRemaining;
      //if (p.stocks <= 0) { finishGame(); return; }
      p.percent = state.percent;

      p.phys.pos.x = state.positionX;
      p.phys.pos.y = state.positionY;
      p.phys.posPrev.x = prevState.positionX;
      p.phys.posPrev.y = prevState.positionY;
      p.phys.posDelta.x = p.phys.pos.x - p.phys.posPrev.x;
      p.phys.posDelta.y = p.phys.pos.y - p.phys.posPrev.y;
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
}