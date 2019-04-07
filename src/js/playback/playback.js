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