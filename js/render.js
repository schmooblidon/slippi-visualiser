function drawArrayPathCompress (can, col, face, tX, tY, path, scaleX, scaleY, rotate, rpX, rpY, extra) {
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

function renderPlayer(i) {
    var temX = (player[i].phys.pos.x * activeStage.scale) + activeStage.offset[0];
    var temY = (player[i].phys.pos.y * -activeStage.scale) + activeStage.offset[1];
    var face = player[i].phys.face;
    var frame = Math.floor(player[i].timer);
    if (frame == 0) {
        frame = 1;
    }
    /*if (frame > framesData[characterSelections[i]][player[i].actionState]) {
        frame = framesData[characterSelections[i]][player[i].actionState];
    }*/
    if(animations[player[i].charID][player[i].actionState] === undefined){
      return;
    }

    if ((frame - 1) > animations[player[i].charID][player[i].actionState].length - 1) {
        frame = animations[player[i].charID][player[i].actionState].length;
    }

    if(animations[player[i].charID][player[i].actionState][frame - 1] === undefined){
       frame = animations[player[i].charID][player[i].actionState].length;
    }
    var model = animations[player[i].charID][player[i].actionState][frame - 1];

    var col = palettes[pPal[i]][0];
    if (player[i].actionState == "ENTRANCE") {
        drawArrayPathCompress(fg2, col, face, temX, temY, model, player[i].charScale * (activeStage.scale /
            4.5), Math.min(player[i].charScale, player[i].charScale * (1.5 -
                startTimer)) * (activeStage.scale / 4.5), player[i].rotation, player[i].rotationPoint.x, player[i].rotationPoint
            .y);
    } else {
        drawArrayPathCompress(fg2, col, face, temX, temY, model, player[i].charScale * (activeStage.scale /
            4.5), player[i].charScale * (activeStage.scale / 4.5), player[i].rotation, player[i].rotationPoint
            .x, player[i].rotationPoint.y);
    }

    if (player[i].phys.shielding) {
        if (!(player[i].phys.powerShielded && player[i].hit.hitlag > 0)) {
            var sX = ((player[i].phys.shieldPositionReal.x) * activeStage.scale) + activeStage.offset[0];
            var sY = ((player[i].phys.shieldPositionReal.y) * -activeStage.scale) + activeStage.offset[1];
            var sCol = palettes[pPal[i]][2];
            if (Math.floor(player[i].hit.shieldstun) > 0) {
                sCol = palettes[pPal[i]][4];
            }
            fg2.fillStyle = sCol + (0.6 * player[i].phys.shieldAnalog) + ")";
            fg2.beginPath();
            fg2.arc(sX, sY, player[i].phys.shieldSize * activeStage.scale, twoPi, 0);
            fg2.fill();
        }
    }
    if (hasTag[i]) {
        fg2.fillStyle = makeColour(0, 0, 0, 0.5);
        fg2.strokeStyle = palettes[pPal[i]][0];
        var size = 10 * tagText[i].length
        fg2.fillRect(temX - size / 2, temY - 130 * (activeStage.scale / 4.5), size, 20);
        fg2.strokeRect(temX - size / 2, temY - 130 * (activeStage.scale / 4.5), size, 20);
        fg2.font = "13px Lucida Console, monaco, monospace";
        fg2.textAlign = "center";
        fg2.fillStyle = "white";
        fg2.fillText(tagText[i], temX, temY + 15 - 130 * (activeStage.scale / 4.5));
        fg2.fillStyle = palettes[pPal[i]][0];
        fg2.beginPath();
        fg2.moveTo(temX - 8, temY + 20 - 130 * (activeStage.scale / 4.5));
        fg2.lineTo(temX + 8, temY + 20 - 130 * (activeStage.scale / 4.5));
        fg2.lineTo(temX, temY + 28 - 130 * (activeStage.scale / 4.5));
        fg2.closePath();
        fg2.fill();
        fg2.textAlign = "start";
    }
    if (player[i].actionState == "REBIRTH" || player[i].actionState == "REBIRTHWAIT") {
        fg2.fillStyle = palettes[pPal[i]][1];
        fg2.strokeStyle = palettes[pPal[i]][0];
        fg2.beginPath();
        fg2.moveTo(temX + 18 * (activeStage.scale / 4.5), temY + 13.5 * (activeStage.scale / 4.5));
        fg2.lineTo(temX + 31.5 * (activeStage.scale / 4.5), temY);
        fg2.lineTo(temX - 31.5 * (activeStage.scale / 4.5), temY);
        fg2.lineTo(temX - 18 * (activeStage.scale / 4.5), temY + 13.5 * (activeStage.scale / 4.5));
        fg2.closePath();
        fg2.fill();
        fg2.stroke();
    }

} 