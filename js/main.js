// SETUP LAYERS
let bg1 = 0;
let bg2 = 0;
let fg1 = 0;
let fg2 = 0;
let ui = 0;
const c = 0;
const canvasMain = 0;
const layers = {
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

function renderToMain (){
  var keys = Object.keys(layers);
  for (var i = 0; i < keys.length; i++) {
    if (layerSwitches[keys[i]]) {
      c.drawImage(layers[keys[i]], 0, 0)
    }
  }
}

const palettes = [["rgb(250, 89, 89)","rgb(255, 170, 170)","rgba(255, 206, 111, ","rgb(244, 68, 68)","rgba(255, 225, 167, "],
["rgb(95, 216, 84)","rgb(184, 253, 154)","rgba(252, 95, 95, ","rgb(255, 182, 96)","rgba(254, 141, 141, "],
["rgb(5, 195, 255)","rgb(121, 223, 255)","rgba(218, 96, 254, ","rgb(231, 134, 255)","rgba(230, 144, 255, "],
["rgb(255, 187, 70)","rgb(248, 255, 122)","rgba(80, 182, 255, ","rgb(255, 142, 70)","rgba(139, 203, 249, "],
["rgb(177, 89, 255)","rgb(203, 144, 255)","rgba(144, 255, 110, ","rgb(247, 126, 250)","rgba(190, 255, 170, "],
["rgb(182, 131, 70)","rgb(252, 194, 126)","rgba(47, 186, 123, ","rgb(255, 112, 66)","rgba(111, 214, 168, "],
["rgb(232, 232, 208)","rgb(255, 255, 255)","rgba(244, 255, 112, ","rgb(191, 119, 119)","rgba(255, 255, 200, "]];
const pPal = [0,1,2,3];

const hasTag = [true,true,false,false];
const tagText = ["SFAT","ZAIN","",""];

const portNumbers = [0, 3, -1, -1];

// BUILD PLAYERS
const CHARIDS = {
    MARTH_ID : 0,
    PUFF_ID : 1,
    FOX_ID : 2,
    FALCO_ID : 3,
    FALCON_ID : 4
};

const CHARNAMES = {
  0 : "MARTH",
  1 : "PUFF",
  2 : "FOX",
  3 : "FALCO",
  4 : "FALCON"
};


player = [
  new playerObject(CHARIDS.FOX_ID, new Vec2D(0,0), 1),
  new playerObject(CHARIDS.MARTH_ID, new Vec2D(0,0), 1),
  0,
  0
];

const playerAmount = 2;

let playing = false;

let currentFrameIdx = -123;
let currentFrame = 0;

let startTimer = 1.5;

function gameTick (){
  currentFrameIdx++;

  if (currentFrameIdx < 0) {
    startTimer -= 0.01666667;
  }

  currentFrame = game.frames[currentFrameIdx];

  for (var i=0;i<playerAmount;i++) {
    var port = portNumbers[i];
    var state = currentFrame.players[port].post;

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

  }

  setTimeout(gameTick, 16);
}

function clearScreen (){
  //bg1.fillStyle = "rgb(0, 0, 0)";
  //bg1.fillRect(0,0,layers.BG1.width,layers.BG1.height);
  bg2.clearRect(0, 0, layers.BG2.width, layers.BG2.height);
  //fg1.clearRect(0,0,layers.FG1.width,layers.FG1.height);
  fg2.clearRect(0, 0, layers.FG2.width, layers.FG2.height);
  ui.clearRect(0, 0, layers.UI.width, layers.UI.height);
}

function renderTick (){
  window.requestAnimationFrame(renderTick);
  if (playing) {
    clearScreen();
    drawBackground();
    drawStage();
    for (var i = 0; i < playerAmount; i++) {
      renderPlayer(i);
    }
  }
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

function start (){
  for (var i=0;i<playerAmount;i++){
    player[i].phys.face = 1;
    player[i].actionState = "WAIT";
  }
  cacheDom();
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
  gameTick();
  renderTick();
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

  resize();

  drawBackgroundInit();
  drawStageInit();
}
window.start = start;

const dom = {};

function cacheDom() {
  const elementIds = [
    "matchMinutes",
    "matchSeconds",
    "gamelogicAvg",
    "gamelogicHigh",
    "gamelogicLow",
    "gamelogicPeak",
    "renderAvg",
    "renderHigh",
    "renderLow",
    "renderPeak",
  ];

  elementIds.forEach((id) => {
    dom[id] = document.getElementById(id);
  });
};