import { curGame, displayDebug } from "./main";

export function setupControls() {
  // arrows only detect on keydown
  $(document).keydown(function(e) {
    // RIGHT
    if (e.which == 39) {
      curGame.playback.frameForward();
    }
    // LEFT
    if (e.which == 37) {
      curGame.playback.frameBackward();
    }
  });

  $(document).keypress(function(e) {
    // ENTER
    if (e.which == 13) {
      curGame.playback.togglePause();
    }
    // D
    if (e.which == 68 || e.which == 100) {
      displayDebug ^= true;
      if (displayDebug) {
        $("#debug").show();
      }
      else {
        $("#debug").hide();
      }
    }
    // R
    if (e.which == 82 || e.which == 114) {
      curGame.playback.restart();
    }
  });
 }

export function setupControlsBox() {
  $( "#controls" )
  .mouseover(function() {
    $( this ).css('opacity', '0.9');
  })
  .mouseout(function() {
    $( this ).css('opacity', '0.15');
  });
}