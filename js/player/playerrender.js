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

function renderPlayer(i) {
    if (player[i].dead) return;
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

    // TURN
    if (player[i].actionState == "SMASHTURN") {
        face *= -1;
    }
    // MARTH BAIR
    else if (player[i].actionState == "ATTACKAIRB" && player[i].charID == CHARIDS.MARTH_ID) {
        if (frame > 29) {
            face *= -1;
        }
    }
    // FOX/FALCO BTHROW
    else if (player[i].actionState == "THROWBACK" && (player[i].charID == CHARIDS.FOX_ID || player[i].charID == CHARIDS.FALCO_ID)) {
        if (frame >= 10) {
            face *= -1;
        }
    }   

    var col = palettes[pPal[i]][0];
    if (temX > 1220 || temX < -20 || temY > 880 || temY < -30) {
        var pA = new Vec2D(temX - 600, temY - 375);
        var pB = new Vec2D(0, 0);
        var s = (pA.y - pB.y) / (pA.x - pB.x);
        if (-375 <= s * 600 && s * 600 <= 375) {
            if (pA.x > pB.x) {
                player[i].miniViewPoint = new Vec2D(1150, s * 600 + 375);
                player[i].miniViewSide = 0;
            } else {
                player[i].miniViewPoint = new Vec2D(50, -s * 600 + 375);
                player[i].miniViewSide = 1;
            }
            player[i].miniView = true;
            player[i].phys.outOfCameraTimer++;
        } else if (-600 <= 375 / s && 375 / s <= 600) {
            if (pA.y > pB.y) {
                if (temX < 50) {
                    player[i].miniViewPoint = new Vec2D(50, 700);
                } else if (temX > 1150) {
                    player[i].miniViewPoint = new Vec2D(1150, 700);
                } else {
                    //player[i].miniViewPoint = new Vec2D(375/s+stage.offset[0],700);
                    player[i].miniViewPoint = new Vec2D(temX, 700);
                }
                player[i].miniViewSide = 2;
            } else {
                player[i].miniViewPoint = new Vec2D(-375 / s + activeStage.offset[0], 50);
                player[i].miniViewSide = 2;
            }
            player[i].miniView = true;
            player[i].phys.outOfCameraTimer++;
        } else {
            player[i].miniView = false;
            player[i].phys.outOfCameraTimer = 0;
        }
    } else {
        player[i].miniView = false;
        player[i].phys.outOfCameraTimer = 0;
    }
    if (player[i].miniView && player[i].actionState != "SLEEP") {
        fg2.fillStyle = "black";
        fg2.strokeStyle = palettes[pPal[i]][0];
        fg2.beginPath();
        fg2.arc(player[i].miniViewPoint.x, player[i].miniViewPoint.y, 35, twoPi, 0);
        fg2.fill();
        fg2.lineWidth = 6;
        fg2.stroke();
        fg2.lineWidth = 1;

        drawArrayPathCompress(fg2, col, face, player[i].miniViewPoint.x, player[i].miniViewPoint.y + 30, model, player[
            i].miniScale, player[i].miniScale, player[i].rotation, player[i].rotationPoint
            .x, player[i].rotationPoint.y);
    } else {
        
        if (player[i].actionState == "ENTRANCE") {
            drawArrayPathCompress(fg2, col, face, temX, temY, model, player[i].charScale * (activeStage.scale /
                4.5), Math.min(player[i].charScale, player[i].charScale * (2.05 -
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
            fg2.lineWidth = 1;
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
    }
    if (player[i].actionState == "REBIRTH" || player[i].actionState == "REBIRTHWAIT") {
        fg2.fillStyle = palettes[pPal[i]][1];
        fg2.strokeStyle = palettes[pPal[i]][0];
        fg2.lineWidth = 1;
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