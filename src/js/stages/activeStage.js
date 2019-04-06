import { Vec2D } from "../utils/Vec2D";
import { Box2D } from "../utils/Box2D";
import vsstages from "./vs-stages/vs-stages";

const stageIds = {
  //000 [000]   // Dummy
  //001 [001]   // TEST

  2 : "fountain", //002 [002]   // Fountain of Dreams (Izumi)
  3 : "pstadium", //003 [003]   // Pokémon Stadium (Pstadium)
  //004 [004]   // Princess Peach's Castle (Castle)
  //005 [005]   // Kongo Jungle (Kongo)
  //006 [006]   // Brinstar (Zebes)
  //007 [007]   // Corneria
  8 : "ystory", //008 [008]   // Yoshi's Story (Story)
  //009 [009]   // Onett
  //010 [00A]   // Mute City
  //011 [00B]   // Rainbow Cruise (RCruise)
  //012 [00C]   // Jungle Japes (Garden)
  //013 [00D]   // Great Bay
  //014 [00E]   // Hyrule Temple (Shrine)
  //015 [00F]   // Brinstar Depths (Kraid)
  //016 [010]   // Yoshi's Island (Yoster)
  //017 [011]   // Green Greens (Greens)
  //018 [012]   // Fourside
  //019 [013]   // Mushroom Kingdom I (Inishie1)
  //020 [014]   // Mushroom Kingdom II (Inishie2)
   // 021 [015]   // Akaneia (Deleted Stage)
  //022 [016]   // Venom
  //023 [017]   // Poké Floats (Pura)
  //025 [019]   // Icicle Mountain (Icemt)

  //026 [01A]   // Icetop
  //027 [01B]   // Flat Zone
  28 : "dreamland", //028 [01C]   // Dream Land N64 (old ppp)
  //029 [01D]   // Yoshi's Island N64 (old yosh)
  //030 [01E]   // Kongo Jungle N64 (old kong)
  31 : "battlefield", //031 [01F]   // Battlefield (battle)
  32 : "fdest" //032 [020]   // Final Destination (last)
}

export function setVsStage(val) {
  activeStage = vsstages[stageIds[val]];
  activeStageID = val;
}

export let activeStageID = 31;

export let activeStage = {
  name : "battlefield",
  box: [],
  polygon : [ [ new Vec2D(-68.4, 0), new Vec2D(68.4, 0), new Vec2D (65, -6), new Vec2D (36, -19)
              , new Vec2D(39, -21), new Vec2D (33, -25), new Vec2D (30, -29), new Vec2D (29, -35)
              , new Vec2D(10, -40), new Vec2D (10, -30), new Vec2D (-10, -30), new Vec2D (-10, -40)
              , new Vec2D(-29, -35), new Vec2D (-30, -29), new Vec2D (-33, -25), new Vec2D(-39, -21)
              , new Vec2D (-36, -19), new Vec2D (-65, -6)
              ]
            ],
  platform: [[new Vec2D(-57.6, 27.2), new Vec2D(-20, 27.2)], [new Vec2D(20, 27.2), new Vec2D(57.6, 27.2)], [new Vec2D(-18.8, 54.4), new Vec2D(18.8, 54.4)]],
  ground: [[new Vec2D(-68.4, 0), new Vec2D(68.4, 0)]],
  ceiling: [[ new Vec2D (-65, -6), new Vec2D (-36, -19)], [ new Vec2D (-29, -35), new Vec2D (-10, -40)], [new Vec2D (-10, -30), new Vec2D (10, -30)], [ new Vec2D (65, -6), new Vec2D (36, -19)], [ new Vec2D (29, -35), new Vec2D (10, -40)]],
  wallL: [[ new Vec2D( -68.4, 0), new Vec2D (-65, -6) ], [ new Vec2D (-36, -19), new Vec2D (-39, -21 )  ], [ new Vec2D (-39, -21 ), new Vec2D (-33, -25)  ], [ new Vec2D (-33, -25), new Vec2D (-30, -29)  ], [ new Vec2D (-30, -29), new Vec2D (-29, -35)  ], [ new Vec2D (10, -30), new Vec2D (10, -40) ]],
  wallR: [[ new Vec2D( 68.4, 0), new Vec2D (65, -6) ], [ new Vec2D (36, -19), new Vec2D (39, -21 )  ], [ new Vec2D (39, -21 ), new Vec2D (33, -25)  ], [ new Vec2D (33, -25), new Vec2D (30, -29)  ], [ new Vec2D (30, -29), new Vec2D (29, -35)  ], [ new Vec2D (-10, -30), new Vec2D (-10, -40) ]],
  startingPoint: [new Vec2D(-50, 50), new Vec2D(50, 50), new Vec2D(-25, 5), new Vec2D(25, 5)],
  startingFace: [1, -1, 1, -1],
  respawnPoints: [new Vec2D(-50, 50), new Vec2D(50, 50), new Vec2D(-25, 35), new Vec2D(25, 35)],
  respawnFace: [1, -1, 1, -1],
  blastzone: new Box2D([-224, -108.8], [224, 200]),
  ledge: [["ground", 0, 0], ["ground", 0, 1]],
  ledgePos: [new Vec2D(-68.4, 0), new Vec2D(68.4, 0)],
  scale: 4.5,
  offset: [600, 480],
  movingPlats : [],
  movingPlatforms: function () {
  }
};

function getActiveStage() {
  return activeStage;
}