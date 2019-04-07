import { players, playerAmount } from "../main";

export let showDebug = false;

export function drawDebug(currentFrameIdx) {
  $("#currentFrame").text(currentFrameIdx.toString());
  for (var i=0;i<playerAmount;i++) {
    var p = players[i];
    var port = p.port;
    $("#p"+port+"_charname").text(p.charName);
    $("#p"+port+"_action_id").text(p.actionStateId);
    $("#p"+port+"_action_name").text(p.actionState);
    $("#p"+port+"_action_counter").text(p.actionStateCounter);

    $("#p"+port+"_input_lsX").text(p.input.lsX);
    $("#p"+port+"_input_lsY").text(p.input.lsY);
    $("#p"+port+"_input_l_trigger").text(p.input.lA);
    $("#p"+port+"_input_r_trigger").text(p.input.rA);
  }
}