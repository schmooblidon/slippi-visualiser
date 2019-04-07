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
    }
  }

  this.frameBackward = function() {
    this.paused = true;
    this.finished = false;
    this.game.currentFrameIdx = Math.max(-123, this.game.currentFrameIdx-1);
    this.game.updateState();
    this.game.renderState();
  }
}

function gameTick(){
  setTimeout(gameTick, 16);
  if (!curGame.playback.playing || curGame.playback.finished || curGame.playback.paused) return;
  curGame.currentFrameIdx++;
  curGame.updateState();
};

function renderTick() {
  window.requestAnimationFrame(renderTick);
  if (!curGame.playback.playing || curGame.playback.finished) return;
  curGame.renderState();
};

function positionSliderChange(event, ui) {
  curGame.currentFrameIdx = ui.value;
}

export function setupSlider() {
  $(function() {
    $("#position").slider({
      min : -123,
      max : 1000,
      change: positionSliderChange
    });
  });
}
