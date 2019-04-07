import Vec2D from "./utils/Vec2D";
import { externalCharacterIDs, characters } from "./characters";
import Input from "./input";

function PhysState(pos, face) {
  this.pos = new Vec2D(pos.x, pos.y);
  this.posPrev = new Vec2D(0, 0);
  this.posDelta = new Vec2D(0, 0);
  this.grounded = false;
  this.airborneTimer = 0;
  this.face = face;
  this.facePrev = 1;
  this.outOfCameraTimer = 0;
}

function Shield() {
  this.active = false;
  this.HP = 60;
  this.size = 0;
  this.analog = 0;
  this.position = new Vec2D(0, 0);
  this.positionReal = new Vec2D(0, 0);
  this.stun = 0;
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
  this.actionState = "ENTRANCE";
  this.prevActionState = "";
  this.actionStateId = 0;
  this.actionStateCounter = 0;
  this.attributes = characters[this.charName];
  this.dead = false;
  this.starKO = false;
  this.percent = 0; 
  this.miniView = false;
  this.miniViewPoint = new Vec2D(0, 0);
  this.percentShake = new Vec2D(0, 0);
  this.rotation = 0;
  this.rotationPoint = new Vec2D(0, 0);
  this.colourOverlay = "";
  this.colourOverlayBool = false;
}
