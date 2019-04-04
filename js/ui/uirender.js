let lostStockQueue = [];

function renderOverlay(showMatchTimer, showStock) {

    // stocks, percent, timer
    ui.strokeStyle = "black";
    if (showMatchTimer) {
        ui.fillStyle = "white";
        ui.lineWidth = 2;
        ui.font = "900 40px Arial";
        ui.textAlign = "center";
        var min = (Math.floor(matchTimer / 60)).toString();
        var sec = (matchTimer % 60).toFixed(2);
        ui.fillText(((min.length < 2) ? "0" + min : min) + ":" + ((sec.length < 5) ? "0" + sec[0] : sec[0] + sec[1]), 590,
            70);
        ui.strokeText(((min.length < 2) ? "0" + min : min) + ":" + ((sec.length < 5) ? "0" + sec[0] : sec[0] + sec[1]),
            590, 70);
        ui.font = "900 25px Arial";
        ui.fillText(((sec.length < 5) ? sec[2] + sec[3] : sec[3] + sec[4]), 670, 70);
        ui.strokeText(((sec.length < 5) ? sec[2] + sec[3] : sec[3] + sec[4]), 670, 70);
    }
    if (showStock) {
        ui.font = "900 53px Arial";
        ui.lineWidth = 2;
        ui.textAlign = "end";
        ui.save();
        ui.scale(0.8, 1);
        for (var i = 0; i < playerAmount; i++) {
            ui.fillStyle = "rgb(255," + Math.max(255 - player[i].percent, 0) + ", " + Math.max(255 - player[i].percent, 0) +
                ")";
            ui.fillText(Math.floor(player[i].percent) + "%", (450 + i * 145 + player[i].percentShake.x) * 1.25, 670 +
                player[i].percentShake.y);
            ui.strokeText(Math.floor(player[i].percent) + "%", (450 + i * 145 + player[i].percentShake.x) * 1.25, 670 +
                player[i].percentShake.y);
        }
        ui.restore();
        for (var i = 0; i < playerAmount; i++) {
            ui.fillStyle = palettes[pPal[i]][0];
            for (var j = 0; j < player[i].stocks; j++) {
                ui.beginPath();
                ui.arc(337 + i * 145 + j * 30, 600, 12, 0, twoPi);
                ui.closePath();
                ui.fill();
                ui.stroke();
            }
        }
        const lostStockPopQueue = [];
        ui.fillStyle = "white";
        ui.strokeStyle = "white";
        for (var i = 0; i < lostStockQueue.length; i++) {
            lostStockQueue[i][2]++;
            if (lostStockQueue[i][2] > 20) {
                lostStockPopQueue.push(i);
            } else {
                ui.save();
                ui.translate(337 + lostStockQueue[i][0] * 145 + lostStockQueue[i][1] * 30 - 2, 600 - 2);
                ui.fillRect(lostStockQueue[i][2], 0, 4, 4);
                ui.fillRect(lostStockQueue[i][2], lostStockQueue[i][2], 4, 4);
                ui.fillRect(-lostStockQueue[i][2], lostStockQueue[i][2], 4, 4);
                ui.fillRect(lostStockQueue[i][2], -lostStockQueue[i][2], 4, 4);
                ui.fillRect(-lostStockQueue[i][2], -lostStockQueue[i][2], 4, 4);
                ui.fillRect(-lostStockQueue[i][2], 0, 4, 4);
                ui.fillRect(0, lostStockQueue[i][2], 4, 4);
                ui.fillRect(0, -lostStockQueue[i][2], 4, 4);
                ui.beginPath();
                ui.arc(2, 2, lostStockQueue[i][2] / 2, 0, twoPi);
                ui.closePath();
                ui.stroke();
                ui.restore();
            }
        }
        for (var k = 0; k < lostStockPopQueue.length; k++) {
            lostStockQueue.splice(lostStockPopQueue[k] - k, 1);
        }
        ui.textAlign = "start";
    }
}

function setLostStockQueue(index,val){
    lostStockQueue[index]=val;
}

function resetLostStockQueue(){
    lostStockQueue = [];
}

function percentShake (kb,i){
  player[i].percentShake = new Vec2D(kb*0.1*Math.random(),kb*0.1*Math.random());
  setTimeout(function(){player[i].percentShake = new Vec2D(kb*0.05*Math.random(),kb*0.05*Math.random())},20);
  setTimeout(function(){player[i].percentShake = new Vec2D(-kb*0.1*Math.random(),-kb*0.1*Math.random())},40);
  setTimeout(function(){player[i].percentShake = new Vec2D(-kb*0.05*Math.random(),-kb*0.05*Math.random())},60);
  setTimeout(function(){player[i].percentShake = new Vec2D(0,0)},80);
}

function gameFinishScreen() {
  fg2.save();
  fg2.textAlign = "center";
  var text = "Game!";
  var size = 300;
  var textScale = 1;
  var textGrad = fg2.createLinearGradient(0, 200, 0, 520);
  if (matchTimer <= 0) {
    text = "Time!";
    //sounds.time.play();
    textGrad.addColorStop(0, "black");
    textGrad.addColorStop(0.5, "black");
    textGrad.addColorStop(0.7, "rgb(21, 51, 180)");
    textGrad.addColorStop(1, "rgb(71, 94, 250)");
  } else {
    //sounds.game.play();
    textGrad.addColorStop(0, "black");
    textGrad.addColorStop(0.4, "black");
    textGrad.addColorStop(0.7, "rgb(167, 27, 40)");
    textGrad.addColorStop(1, "rgb(255, 31, 52)");
  }
  fg2.scale(1, textScale);
  fg2.fillStyle = textGrad;
  fg2.lineWidth = 40;
  fg2.strokeStyle = "black";
  fg2.font = "900 " + size + "px Arial";
  fg2.strokeText(text, 600, 470 / textScale);
  fg2.lineWidth = 20;
  fg2.strokeStyle = "white";
  fg2.font = "900 " + size + "px Arial";
  fg2.strokeText(text, 600, 470 / textScale);
  fg2.font = "900 " + size + "px Arial";
  fg2.fillText(text, 600, 470 / textScale);
  fg2.restore();
}