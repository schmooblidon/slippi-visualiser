import { Vec2D } from "../utils/Vec2D";
import { externalCharacterIDs, characters } from "../characters/characters";

function physicsObject(pos, face) {
  this.pos = new Vec2D(pos.x, pos.y);
  this.posPrev = new Vec2D(0, 0);
  this.posDelta = new Vec2D(0, 0);
  this.grounded = false;
  this.airborneTimer = 0;
  this.face = face;
  this.shieldHP = 60;
  this.shieldSize = 0;
  this.shieldAnalog = 0;
  this.shielding = false;
  this.shieldPosition = new Vec2D(0, 0);
  this.shieldPosition = new Vec2D(0, 0);
  this.shieldPositionReal = new Vec2D(0, 0);
  this.shieldPositionReal = new Vec2D(0, 0);
  this.shieldstun = 0;
  this.facePrev = 1;
  this.outOfCameraTimer = 0;
}

function inputObject() {
  this.lsX = [0,0,0,0,0,0,0,0];
  this.lsY = [0, 0, 0, 0, 0, 0, 0, 0];
  this.rawX = [0, 0, 0, 0, 0, 0, 0, 0];
  this.rawY = [0, 0, 0, 0, 0, 0, 0, 0];
  this.csX = [0, 0, 0, 0, 0, 0, 0, 0];
  this.csY = [0, 0, 0, 0, 0, 0, 0, 0];
  this.lA = [0, 0, 0, 0, 0, 0, 0, 0];
  this.rA = [0, 0, 0, 0, 0, 0, 0, 0];
  this.s = [false, false, false, false, false, false, false, false];
  this.z = [false, false, false, false, false, false, false, false];
  this.a = [false, false, false, false, false, false, false, false];
  this.b = [false, false, false, false, false, false, false, false];
  this.x = [false, false, false, false, false, false, false, false];
  this.y = [false, false, false, false, false, false, false, false];
  this.r = [false, false, false, false, false, false, false, false];
  this.l = [false, false, false, false, false, false, false, false];
  this.dl = [false, false, false, false, false, false, false];
  this.dd = [false, false, false, false, false, false, false];
  this.dr = [false, false, false, false, false, false, false];
  this.du = [false, false, false, false, false, false, false];
}

export function playerObject(playerIndex, port, characterId, characterColor, startStocks, type, teamId, nametag, pos, face) {
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
  this.phys = new physicsObject(pos, face);
  this.input = new inputObject();
  this.actionState = "ENTRANCE";
  this.prevActionState = "";
  this.timer = 0;
  this.attributes = characters[this.charName];
  this.dead = false;
  this.percent = 0; 
  this.miniView = false;
  this.miniViewPoint = new Vec2D(0, 0);
  this.percentShake = new Vec2D(0, 0);
  this.rotation = 0;
  this.rotationPoint = new Vec2D(0, 0);
  this.colourOverlay = "";
  this.colourOverlayBool = false;
}
