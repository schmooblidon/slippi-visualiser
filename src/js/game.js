import Playback from "./playback";
import Player from "./player";
import { getStage } from "./stages/stages";
import Vec2D from "./utils/Vec2D";
import { clearScreen } from "./draw/draw";
import { drawPlayer } from "./draw/draw_player";
import { drawGameFinishScreen, drawOverlay } from "./draw/draw_ui";
import { drawBackground, drawStage } from "./draw/draw_stage";
import { drawDebug } from "./draw/debug";
import { displayDebug } from "./main";

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
      drawPlayer(this, i);
    }
    drawOverlay(this, true, true);

    if (displayDebug) drawDebug(this);
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

      // TODO : need a better way to feed this the opponent
      // need to feed opponent for thrown states, altho this may be tricky in teams
      p.update(state, prevState, slp_input, this.players[1-i]);

    } 
  }
}