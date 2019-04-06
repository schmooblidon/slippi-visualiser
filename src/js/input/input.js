
const Button = {
  none : 0x0000,
  dpadLeft : 0x0001,
  dpadRight : 0x0002,
  dpadDown : 0x0004,
  dpadUp : 0x0008,
  z : 0x0010,
  r : 0x0020,
  l : 0x0040,
  a : 0x0100,
  b : 0x0200,
  x : 0x0400,
  y : 0x0800,
  start : 0x1000
}

export function setInput(p, input) {
  p.input.lsX = input.joystickX;
  p.input.lsY = input.joystickY;
  p.input.csX = input.cStickX;
  p.input.csY = input.cStickY;

  var buttons = input.physicalButtons;

  p.input.dpadLeft = (buttons & Button.dpadLeft) != Button.none;
  p.input.dpadRight = (buttons & Button.dpadRight) != Button.none;
  p.input.dpadDown = (buttons & Button.dpadDown) != Button.none;
  p.input.dpadUp = (buttons & Button.dpadUp) != Button.none;
  p.input.z = (buttons & Button.z) != Button.none;
  p.input.r = (buttons & Button.r) != Button.none;
  p.input.l = (buttons & Button.l) != Button.none;
  p.input.a = (buttons & Button.a) != Button.none;
  p.input.b = (buttons & Button.b) != Button.none;
  p.input.x = (buttons & Button.x) != Button.none;
  p.input.y = (buttons & Button.y) != Button.none;
  p.input.start = (buttons & Button.start) != Button.none;

  p.input.rA = p.input.r ? 1 : input.physicalRTrigger;
  p.input.lA = p.input.l ? 1 : input.physicalLTrigger;

}