import { getState } from "../store";
import EntityData, { FacilityDataType } from "./entities";
import { PlayerData, hasFacility } from "./player";

export type TutorialStep = {
  name: string;
  text: string;
  inventory: FacilityDataType[];
  screens: TutorialScreen[];
  completedCondition: (player: PlayerData) => boolean;
  startCondition: (player: PlayerData) => boolean;
  onExitScreens?: () => boolean;
};

export type TutorialScreen = {
  name: string;
  text: string;
  image?: string;
  entity?: FacilityDataType;
};

export const evaluateTutorials = async () => {
  // check player data for completed tutorials
  const player = getState().player.playerData;
  const finishedTutorials = player.finishedTutorials || [];
  let activeTutorials = player.activeTutorials || [];
  for (const t of player.activeTutorials) {
    const activeTutorial = tutorialSteps.find((step) => step.name === t);
    if (activeTutorial?.completedCondition(player)) {
      activeTutorials = [];
      if (!finishedTutorials.includes(activeTutorial.name)) {
        finishedTutorials.push(activeTutorial.name);
      }
    }
  }
  if (activeTutorials.length < 1) {
    for (const t of tutorialSteps.filter(
      (t) => !finishedTutorials.includes(t.name)
    )) {
      const availabletutorial = t;
      if (availabletutorial.completedCondition(player)) {
        finishedTutorials.push(availabletutorial.name);
        continue;
      } else if (
        availabletutorial?.startCondition(player) &&
        !activeTutorials.includes(t.name)
      ) {
        activeTutorials.push(availabletutorial.name);
      }
    }
  }
  getState().player.setPlayerData({
    ...player,
    activeTutorials,
    finishedTutorials,
  });
  if (activeTutorials.length > 0) {
    const event = new Event("activeTutorial");
    document.dispatchEvent(event);
  }
};

export const completeTutorial = async (tutorialName: string) => {
  const player = getState().player.playerData;
  const finishedTutorials = player.finishedTutorials || [];
  if (!finishedTutorials.includes(tutorialName)) {
    finishedTutorials.push(tutorialName);
  }
  //remove from active
  const activeTutorials = player.activeTutorials.filter(
    (t) => t !== tutorialName
  );

  getState().player.setPlayerData({
    ...player,
    finishedTutorials,
    activeTutorials,
  });
};

export const tutorialSteps = [
  {
    name: "intro",
    text: "Let's start by building a Gravity Hill",
    inventory: [EntityData.facilities.gravityhill],
    completedCondition: (player: PlayerData) => {
      return hasFacility(
        player,
        EntityData.facilities.gravityhill.entityTypeId
      );
    },
    startCondition: () => {
      return true;
    },
    screens: [
      {
        name: "A world of floating cities",
        text: "In a realm where the vastness of the cosmos meets the dreams of mortals, floating cities known as <b>Laputas</b> drift amidst the stars, tethered only by the delicate dance of gravity and ambition.<br/><br/>As a visionary architect of this celestial expanse, you are tasked with weaving together resources, imagination, and the very essence of the universe, to sculpt a city that not only floats but thrives. <br/>Let the dance of construction and collaboration begin, for in this ballet of creation, every tile, every choice, and every alliance matters.<br/><br/>Welcome, builder of the skies, to a journey of wonder and infinite possibilities.",
        image: "scroll.webp",
      },
      {
        name: "Into the skies!",
        text: `Embark on the foundational step of your skyward journey: the <b>Gravity Hill</b>. This magnificent contraption is the beating heart of your floating haven, generating the essential force of <b>gravity</b>.<br/><br/>
        ${EntityData.facilities.gravityhill.description}<br/><br/><i><b>Choose the Gravity Hill from your inventory, and place it</b></i> to set the cornerstone of your ethereal city.`,
        entity: EntityData.facilities.gravityhill,
      },
    ],
  },
  {
    name: "power-up",
    text: "Power it all up",
    inventory: [
      EntityData.facilities.gravityhill,
      EntityData.facilities.dynamo,
    ],
    completedCondition: (player: PlayerData) => {
      return hasFacility(player, EntityData.facilities.dynamo.entityTypeId);
    },
    startCondition: (player: PlayerData) => {
      return hasFacility(
        player,
        EntityData.facilities.gravityhill.entityTypeId
      );
    },
    screens: [
      {
        name: "Power it up",
        text: `As your floating city takes shape, energy shall become the lifeblood that keeps it alive and thriving. The Whirly Dynamo was born out of sheer necessity and innovation. As the demand for airborne cities increased, traditional power sources proved inefficient. Groundbreaking engineers and physicists from around the world convened, seeking a solution that could harness the vast energy potential of the stratosphere. Their answer was the Whirly Dynamo.<br/><br>Today, the Whirly Dynamo stands not just as a beacon of energy but as a testament to STAKAC's unwavering commitment to innovation and progress.`,
        image: `turbine3.webp`,
      },
      {
        name: "Power it up",
        text: `Massive components were manufactured in STAKAC's off-site facilities and then airlifted for assembly, a process that required precision and coordination given the sheer size of the dynamo. This majestic device captures the whispers and roars of the cosmic breezes, converting them into the vital energy your city craves. Place it, and watch as it breathes life into your creations, illuminating the skies with its radiant aura.<br/><br/>
        ${EntityData.facilities.dynamo.description}`,
        entity: EntityData.facilities.dynamo,
      },
    ],
  },
  {
    name: "living",
    text: "Make it a life worth living",
    inventory: [
      EntityData.facilities.gravityhill,
      EntityData.facilities.dynamo,
      EntityData.facilities.residence,
      EntityData.facilities.scaffold,
    ],
    completedCondition: (player: PlayerData) => {
      return hasFacility(player, EntityData.facilities.residence.entityTypeId);
    },
    startCondition: (player: PlayerData) => {
      return hasFacility(player, EntityData.facilities.dynamo.entityTypeId);
    },
    screens: [
      {
        name: "A place to put your stuff",
        text: `With the basic infrastructure in place, it's time to craft a space of warmth, comfort, and belonging. The Residence stands as a beacon of hope and rest for the citizens of your city. As you construct these abodes, you're not just building structures; you're crafting homes, stories, and memories. Place them with care, and watch as life, laughter, and dreams fill the spaces within.<br/><br/>
        ${EntityData.facilities.residence.description}<br/><br/><b>Build a residence for your citizens</b>`,
        entity: EntityData.facilities.residence,
        image: "house.webp",
      },
    ],
  },
  {
    name: "making money",
    text: "Make it a life worth living",
    inventory: [
      EntityData.facilities.gravityhill,
      EntityData.facilities.dynamo,
      EntityData.facilities.residence,
      EntityData.facilities.scaffold,
    ],
    completedCondition: (player: PlayerData) => {
      return hasWallet(player);
    },
    startCondition: (player: PlayerData) => {
      return hasFacility(player, EntityData.facilities.residence.entityTypeId);
    },
    onExitScreens: () => {
      console.log("woop woop");
    },
    screens: [
      {
        name: "Making money",
        text: `In the symphony of the skies, where gravity dances and dynamos sing, it's the heartbeat of the population that brings true prosperity. As the denizens of your floating city find their homes, they don't just live—they thrive, they dream, and they contribute. With every beat of life, with every shared story, the magic of LAPU starts to accumulate.<br/><br/>It's not just currency; it's a manifestation of hope, hard work, and harmony. Embrace this rhythm, for in this celestial economy, the wealth isn't just in coins but in the vibrant life that generates it.<br/><br/>`,
        image: `friends.webp`,
      },
      {
        name: "Keep it safe",
        text: `Now that you're generating income, let's make sure we store it in a safe place for you.<br/><br/>`,
        image: `vault2.webp`,
      },
    ],
  },
] as TutorialStep[];

const hasWallet = (player: PlayerData) => {
  player;
  return false;
};
