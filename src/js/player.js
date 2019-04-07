import Vec2D from "./utils/Vec2D";
import { externalCharacterIDs, characters } from "./characters";
import { actions, specials } from "./actions";
import Input from "./input";
import { lostStockQueue } from "./draw/draw_ui";

function PhysState(pos, face) {
  this.pos = new Vec2D(pos.x, pos.y);
  this.posPrev = new Vec2D(0, 0);
  this.posDelta = new Vec2D(0, 0);
  this.grounded = false;
  this.airborneTimer = 0;
  this.face = face;
  this.facePrev = 1;

  this.update = function(state, prevState) {
    this.pos.x = state.positionX;
    this.pos.y = state.positionY;
    this.posPrev.x = prevState.positionX;
    this.posPrev.y = prevState.positionY;
    this.posDelta.x = this.pos.x - this.posPrev.x;
    this.posDelta.y = this.pos.y - this.posPrev.y;
    this.face = state.facingDirection;
    this.facePrev = prevState.facingDirection;
  }
}

function Action() {
  this.id = 0;
  this.name = "NONE";
  this.counter = 0;

  this.update = function(charID, actionID, state, opponent) {
    this.id = actionID;
    this.counter = state.actionStateCounter;
    this.name = actions[actionID];

    // THROWN STATES
    if (actionID >= 0x0EF && actionID <= 0x0F3) {
      this.name = this.name.substr(0, 6) + externalCharacterIDs[opponent.charID] + this.name.substr(6,10);
    }

    //SPECIALS
    if (actionID >= 341 && actionID <= 372) {
      this.name = specials[externalCharacterIDs[charID]][actionID];
    }
  }
}

function Shield() {
  this.active = false;
  this.HP = 60;
  this.size = 0;
  this.analog = 0;
  this.position = new Vec2D(0, 0);
  this.stun = 0;

  this.update = function(actionID, state, input) {
    // SHIELD ON STATES
    if (actionID >= 0x0B2 && actionID <= 0x0B6) {
      this.active = true;
      this.HP = state.shieldSize;
      this.size = (this.HP / 60) * 7.7696875;
      this.stun = (actionID == 0x0B5) ? 1 : 0;
      this.analog = Math.max(input.rA, input.lA);
      if (!this.stun) {
        var x = input.lStick.x;
        var y = input.lStick.y;
        var offset = Math.sqrt(x * x + y * y) * 3;
        var angle = Math.atan2(y, x);
        this.position =  new Vec2D(Math.cos(angle) * offset, Math.sin(angle) * offset);
      }
    }
    else {
      this.active = false;
    }
  }
}

export default function Player(playerIndex, port, characterId, characterColor, startStocks, type, teamId, nametag, pos, face) {
  this.playerIndex = playerIndex;
  this.port = port;
  this.charID = characterId;
  this.charName = externalCharacterIDs[this.charID];
  this.charColor = characterColor;
  this.stocks = startStocks;
  this.type = type; // this is probs like CPU or HUMAN?
  this.teamId = teamId;
  this.hasNametag = (nametag != "");
  this.nametag = nametag;
  this.phys = new PhysState(pos, face);
  this.input = new Input();
  this.shield = new Shield();
  this.attributes = characters[this.charName];
  this.action = new Action();
  this.dead = false;
  this.starKO = false;
  this.percent = 0; 
  this.miniView = false;
  this.miniViewPoint = new Vec2D(0, 0);
  this.percent_pos = new Vec2D(0, 0);
  this.rotation = 0;
  this.rotationPoint = new Vec2D(0, 0);
  this.colourOverlay = "";
  this.colourOverlayBool = false;

  this.update = function(state, prevState, slp_input, opponent) {
    this.input.setInput(slp_input);

    if (this.stocks != state.stocksRemaining) lostStockQueue.push([this.port - 1, state.stocksRemaining, 0]);
    if (this.percent != state.percent) this.percentShake(Math.abs(state.percent - this.percent)*8);

    this.stocks = state.stocksRemaining;
    this.percent = state.percent;

    this.phys.update(state, prevState);

    var actionID = state.actionStateId;

    this.action.update(this.charID, actionID, state, opponent);

    this.shield.update(actionID, state, this.input);

    //DEAD
    this.dead = (actionID >= 0x000 && actionID <= 0x003);

    //STARKO
    this.starKO = actionID == 0x004;
  }

  this.getShieldPosition = function() {
    return new Vec2D(this.phys.pos.x + this.shield.position.x + (this.attributes.shieldOffset.x * this.phys.face / 4.5), this.phys.pos.y + this.shield.position.y + (this.attributes.shieldOffset.y / 4.5));
  }

  this.percentShake = function(kb){
    this.percent_pos = new Vec2D(kb*0.1*Math.random(),kb*0.1*Math.random());
    var p = this;
    setTimeout(function(){p.percent_pos = new Vec2D(kb*0.05*Math.random(),kb*0.05*Math.random())},20);
    setTimeout(function(){p.percent_pos = new Vec2D(-kb*0.1*Math.random(),-kb*0.1*Math.random())},40);
    setTimeout(function(){p.percent_pos = new Vec2D(-kb*0.05*Math.random(),-kb*0.05*Math.random())},60);
    setTimeout(function(){p.percent_pos = new Vec2D(0,0)},80);
  }
}
