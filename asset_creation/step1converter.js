// SORRY FOR THE OLD SPAGHETTI CODE

asNames = [
"APPEAL",
"ATTACKAIRB",
"ATTACKAIRD",
"ATTACKAIRF",
"ATTACKAIRN",
"ATTACKAIRU",
"ATTACKDASH",
"CAPTURECUT",
"CAPTUREDAMAGE",
"CAPTUREPULLED",
"CAPTUREWAIT",
"CATCHATTACK",
"CATCHCUT",
"CATCHWAIT",
"CLIFFATTACKQUICK",
"CLIFFATTACKSLOW",
"CLIFFCATCH",
"CLIFFESCAPEQUICK",
"CLIFFESCAPESLOW",
"CLIFFGETUPQUICK",
"CLIFFGETUPSLOW",
"CLIFFJUMPQUICK",
"CLIFFJUMPSLOW",
"CLIFFWAIT",
"DAMAGEFALL",
"DAMAGEFLYN",
"DAMAGEN2",
"DASH",
"DOWNATTACK",
"DOWNBOUND",
"DOWNDAMAGE",
"DOWNSMASH",
"DOWNSTANDB",
"DOWNSTANDF",
"DOWNSTANDN",
"DOWNTILT",
"DOWNWAIT",
"ESCAPEAIR",
"ESCAPEB",
"ESCAPEF",
"ESCAPEN",
"FALL",
"FALLAERIAL",
"FALLSPECIAL",
"FORWARDSMASH",
"FORWARDTILT",
"FURAFURA",
"FURASLEEPEND",
"FURASLEEPLOOP",
"FURASLEEPSTART",
"GRAB",
"GUARD",
"GUARDOFF",
"GUARDON",
"JAB1",
"JUMPAERIALB",
"JUMPAERIALF",
"JUMPB",
"JUMPF",
"KNEEBEND",
"LANDING",
"LANDINGATTACKAIRB",
"LANDINGATTACKAIRD",
"LANDINGATTACKAIRF",
"LANDINGATTACKAIRN",
"LANDINGATTACKAIRU",
"MISSFOOT",
"OTTOTTO",
"OTTOTTOWAIT",
"PASS",
"REBOUND",
"RUN",
"RUNBRAKE",
"RUNTURN",
"SMASHTURN",
"SQUAT",
"SQUATRV",
"SQUATWAIT",
"STOPCEIL",
"TECHB",
"TECHF",
"TECHN",
"TECHU",
"THROWBACK",
"THROWDOWN",
"THROWFORWARD",
"THROWUP",
"TILTTURN",
"UPSMASH",
"UPTILT",
"WAIT",
"WALK",
"WALLDAMAGE",
"WALLJUMP",
"WALLTECH",
"WALLTECHJUMP",

"THROWNFALCOBACK",
"THROWNFALCODOWN",
"THROWNFALCOFORWARD",
"THROWNFALCOUP",
"THROWNFALCONBACK",
"THROWNFALCONDOWN",
"THROWNFALCONFORWARD",
"THROWNFALCONUP",
"THROWNFOXBACK",
"THROWNFOXDOWN",
"THROWNFOXFORWARD",
"THROWNFOXUP",
"THROWNMARTHBACK",
"THROWNMARTHDOWN",
"THROWNMARTHFORWARD",
"THROWNMARTHUP",
"THROWNPUFFBACK",
"THROWNPUFFDOWN",
"THROWNPUFFFORWARD",
"THROWNPUFFUP",
"THROWNSHEIKBACK",
"THROWNSHEIKDOWN",
"THROWNSHEIKFORWARD",
"THROWNSHEIKUP",

"JAB2",
"JAB3",

"DOWNSPECIALAIR",
"DOWNSPECIALGROUND",
"NEUTRALSPECIALAIR",
"NEUTRALSPECIALGROUND",
"SIDESPECIALAIR",
"SIDESPECIALGROUND",
"UPSPECIAL",

"DOWNSPECIALAIRENDAIR",
"DOWNSPECIALAIRENDGROUND",
"DOWNSPECIALGROUNDENDAIR",
"DOWNSPECIALGROUNDENDGROUND",
"SIDESPECIALAIRHIT",
"SIDESPECIALGROUNDHIT",
"UPSPECIALCATCH",
"UPSPECIALTHROW"
];

function convert(name, svg){
  var t = name+":[";
  var foundAll = false;
  var counter = 0;
  var pLength = svg[0].children.length;
  /* for general (old res 1244 1024*/
  /*var displaceX = 620;
  var displaceY = 335;*/
  /* for general (new res 1312 1080)*/
  var displaceX = 620;
  var displaceY = 323;
  var scale = 1;
  // for new puff var scale = 1.75;
  while (!foundAll){
    var point = 0;
    var foundAllSections = false;
    var first = true;
    if (counter < pLength){
      var path = svg[0].children[counter].outerHTML;
      var pStart = path.indexOf("M",0);
      var pEnd = path.indexOf("Z",pStart);
      var d = path.substr(pStart,pEnd+1-pStart);
      if (!first){
        t += ",";
      }
      else {
        first = false;
      }
      t += "[";

      while (!foundAllSections){

        var start = d.indexOf("C",point);
        if (start == -1){
          foundAllSections = true;
        }
        else {
          var Mpoint = d.indexOf("M",point-1);

          move = d.substr(Mpoint+1,(start-1)-(Mpoint+1));
          move = move.split(",");
          t += "["+Math.round((parseFloat(move[0])-displaceX)*scale)+","+Math.round((parseFloat(move[1])-displaceY)*scale)+"],";
          var end = d.indexOf("Z",start+1);
          var curves = d.substr(start+2,(end-1)-(start+2));
          point = end+1;
          curves = curves.split("              ");

          for (var i=0;i<curves.length;i++){
            t += "[";
            curves[i] = curves[i].replace(/ /g, ",");
            curves[i] = curves[i].split(",");
            for (var j=0;j<6;j++){
              if (j%2){
                t += Math.round((parseFloat(curves[i][j])-displaceY)*scale);
              }
              else {
                t += Math.round((parseFloat(curves[i][j])-displaceX)*scale);
              }

              if (j != 5){
                t += ",";
              }
            }
            t += "],";
          }
        }
      }
      t = t.slice(0,-1);
      t += "],";
      counter++;
    }
    else {
      foundAll = true;
      t = t.slice(0,-1);
      t += "]";
    }
  }
  return t;
}

l=0;
maintext = "";

function getSvgData(k){
  $.get("svgs/"+asNames[k]+".svg", null, function(data){
    var name = asNames[l];
    l++;
    var svgNode = $("svg", data);
    console.log(svgNode);
    var text = convert(asNames[k],svgNode);
    maintext += text;
    maintext += ",";
  }, 'xml');
  return true;
}



$(document).ready(function(){

  for (k=0;k<asNames.length;k++){

      if (getSvgData(k)){
        console.log("+");
      }
      else {
        console.log("-");
      }

  }
  setTimeout(function(){$("#anims").html(maintext)},5000);


});
