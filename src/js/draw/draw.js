import { Vec2D } from "../utils/Vec2D";

// SETUP LAYERS
export let bg1 = 0;
export let bg2 = 0;
export let fg1 = 0;
export let fg2 = 0;
export let ui = 0;
export const c = 0;
export const canvasMain = 0;
export const layers = {
  BG1 : 0,
  BG2 : 0,
  FG1 : 0,
  FG2 : 0,
  UI : 0
};
const layerSwitches = {
  BG1 : true,
  BG2 : true,
  FG1 : true,
  FG2 : true,
  UI : true
};

export function clearScreen (){
  bg2.clearRect(0, 0, layers.BG2.width, layers.BG2.height);
  fg2.clearRect(0, 0, layers.FG2.width, layers.FG2.height);
  ui.clearRect(0, 0, layers.UI.width, layers.UI.height);
}

export function setupLayers() {
  layers.BG1 = document.getElementById("background1Canvas");
  bg1 = layers.BG1.getContext("2d");
  layers.BG2 = document.getElementById("background2Canvas");
  bg2 = layers.BG2.getContext("2d");
  layers.FG1 = document.getElementById("foreground1Canvas");
  fg1 = layers.FG1.getContext("2d");
  layers.FG2 = document.getElementById("foreground2Canvas");
  fg2 = layers.FG2.getContext("2d");
  layers.UI = document.getElementById("uiCanvas");
  ui = layers.UI.getContext("2d");
  bg1.fillStyle = "rgb(0, 0, 0)";
  bg1.fillRect(0, 0, layers.BG1.width, layers.BG1.height);
}

export function renderToMain (){
  var keys = Object.keys(layers);
  for (var i = 0; i < keys.length; i++) {
    if (layerSwitches[keys[i]]) {
      c.drawImage(layers[keys[i]], 0, 0)
    }
  }
}

export function rotateVector(vecx, vecy, ang) {
    return new Vec2D(
        vecx * Math.cos(ang) - vecy * Math.sin(ang),
        vecx * Math.sin(ang) + vecy * Math.cos(ang));
}

export function drawArrayPathCompress (can, col, face, tX, tY, path, scaleX, scaleY, rotate, rpX, rpY, extra) {
  can.save();
  if (extra !== undefined) {
    extra();
  }
  can.translate(tX - rpX, tY - rpY);
  can.rotate(rotate);

  can.fillStyle = col;
  can.beginPath();
  // for each shape
  if(path !== undefined && path !== null && path.length !== undefined) {

    for (var j = 0; j < path.length; j++) {
        // first 2 numbers are starting vector points
        var x = (path[j][0] * scaleX * face) + rpX;
        var y = (path[j][1] * scaleY) + rpY;
        can.moveTo(x, y);
        // starting from index 2, each set of 6 numbers are bezier curve coords
        for (var k = 2; k < path[j].length; k += 6) {
            can.bezierCurveTo((path[j][k] * scaleX * face) + rpX, (path[j][k + 1] * scaleY) + rpY, (path[j][k + 2] * scaleX *
                face) + rpX, (path[j][k + 3] * scaleY) + rpY, (path[j][k + 4] * scaleX * face) + rpX, (path[j][k + 5] *
                scaleY) + rpY);
        }
    }
  }
  can.closePath();
  can.fill();
  can.restore();
}

function onFullScreenChange() {
  var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;

  // if in fullscreen mode fullscreenElement won't be null
  /*var cont = document.getElementById("topButtonContainer");
  var icn = document.querySelectorAll(".topButton");
  if (fullscreenElement != null){
    cont.style.transition = "opacity 0.5s linear 0s";
    cont.style.opacity = 0;;
    setTimeout(function(){
        var i;
        for (i = 0; i < icn.length; i++) {
          icn[i].style.height = "5px";
        }
        cont.style.height = "5px";
        resize();
      }, 500);
    $("#keyboardPrompt").hide();
    $("#keyboardControlsImg").hide();
    $("#controllerSupportContainer").hide();
    $("#debugButtonEdit").empty().append("OFF");
    $("#debug").hide();
    $("#players").hide();
    $("body").css("overflow", "hidden");
    showHeader = false;
  } else {
    var i;
    for (i = 0; i < icn.length; i++) {
      icn[i].style.height = "25px";
    }
    cont.style.height = "31px";
    cont.style.transition = "opacity 0.5s linear 0s";
    cont.style.opacity = 1;
  }*/
}

export function setupFullscreenChange() {
  /*$("#fullscreenButton").click(function() {
    if ((document.fullScreenElement && document.fullScreenElement !== null) || (!document.mozFullScreen && !
        document.webkitIsFullScreen)) {
      if (document.documentElement.requestFullScreen) {
        document.documentElement.requestFullScreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullScreen) {
        document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
    // resize();
  });*/

  document.addEventListener("fullscreenchange", onFullScreenChange, false);
  document.addEventListener("webkitfullscreenchange", onFullScreenChange, false);
  document.addEventListener("mozfullscreenchange", onFullScreenChange, false);
}

export function setupElementInteractions() {
  $( "#controls" )
  .mouseover(function() {
    $( this ).css('opacity', '0.9');
  })
  .mouseout(function() {
    $( this ).css('opacity', '0.15');
  });
}