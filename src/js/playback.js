import { drawBackgroundInit, drawStageInit } from "./draw/draw_stage";

export default function Playback(game) {
  this.game = game;
  this.playing = false;
  this.paused = false;
  this.finished = false;

  this.start = function() {
    drawBackgroundInit();
    drawStageInit();

    this.playing = true;
    this.gameTick();
    this,renderTick();
  }

  this.gameTick = function(){
    setTimeout(this.gameTick, 16);
    if (!this.playing || this.finished || this.paused) return;
    this.game.currentFrameIdx++;
    this.game.updateState();
  },

  this.renderTick = function() {
    window.requestAnimationFrame(this.renderTick);
    if (!this.playing || this.finished) return;
    this.game.renderState();
  },

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
    this.game.currentFrameIdx = Math.max(-123, this.game..currentFrameIdx-1);
    this.game.updateState();
    this.game.renderState();
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

function positionSliderChange(event, ui) {
  currentFrameIdx = ui.value;
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
