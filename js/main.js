
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

    //SPECIALS
    if (actionID >= 341 && actionID <= 372) {
      player[i].actionState = specials[CHARNAMES[player[i].charID]][actionID];
    }

  }

  setTimeout(gameTick, 16);
}

function clearScreen (){
  bg2.clearRect(0, 0, layers.BG2.width, layers.BG2.height);
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

function start (){
  for (var i=0;i<playerAmount;i++){
    player[i].phys.face = 1;
    player[i].actionState = "WAIT";
  }
  setupLayers();
  gameTick();
  renderTick();
  
  setupFullscreenChange();
  resize();

  drawBackgroundInit();
  drawStageInit();
}
window.start = start;