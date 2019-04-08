import { drawBackgroundInit, drawStageInit } from "./draw/draw_stage";
import { curGame, showDebug } from "./main";

export default function Playback(game) {
  this.game = game;
  this.playing = false;
  this.paused = false;
  this.finished = false;

  this.start = function() {
    drawBackgroundInit();
    drawStageInit(this.game.stage);

    this.playing = true;
    gameTick();
    renderTick();
  }

  this.restart = function() {
    this.game.currentFrameIdx = -123;
    this.paused = false;
    this.finished = false;
    this.playing = true;
    $('input[type="range"]').val(this.game.currentFrameIdx).change();
  }

  this.togglePause = function() {
    this.paused ^= true;
  }

  this.frameForward = function(){
    this.paused = true;
    if (!this.finished) {
      this.game.currentFrameIdx++;
      this.game.updateState();
      this.game.renderState();
      $('input[type="range"]').val(this.game.currentFrameIdx).change();
    }
  }

  this.frameBackward = function() {
    this.paused = true;
    this.finished = false;
    this.game.currentFrameIdx = Math.max(-123, this.game.currentFrameIdx-1);
    this.game.updateState();
    this.game.renderState();
    $('input[type="range"]').val(this.game.currentFrameIdx).change();
  }
}

function gameTick(){
  setTimeout(gameTick, 16);
  if (!curGame.playback.playing || curGame.playback.finished || curGame.playback.paused) return;
  curGame.currentFrameIdx++;
  curGame.updateState();
  $('input[type="range"]').val(curGame.currentFrameIdx).change();
};

function renderTick() {
  window.requestAnimationFrame(renderTick);
  if (!curGame.playback.playing || curGame.playback.finished) return;
  curGame.renderState();
};