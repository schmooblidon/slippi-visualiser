export function drawDebug(g) {
  $("#currentFrame").text(g.currentFrameIdx.toString());
  for (var i=0;i<g.playerAmount;i++) {
    var p = g.players[i];
    var port = p.port;
    $("#p"+port+"_charname").text(p.charName);
    $("#p"+port+"_action_id").text(p.actionStateId);
    $("#p"+port+"_action_name").text(p.actionState);
    $("#p"+port+"_action_counter").text(p.actionStateCounter);

    $("#p"+port+"_input_lsX").text(p.input.lStick.x);
    $("#p"+port+"_input_lsY").text(p.input.lStick.y);
    $("#p"+port+"_input_l_trigger").text(p.input.lA);
    $("#p"+port+"_input_r_trigger").text(p.input.rA);
  }
}