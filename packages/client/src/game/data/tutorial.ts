import EntityData, { FacilityDataType } from "./entities";
import { PlayerData, hasFacility } from "./player";

export type TutorialStep = {
  name: string;
  text: string;
  inventory: FacilityDataType[];
  requires: FacilityDataType[];
  screens: TutorialScreen[];
};

export type TutorialScreen = {
  name: string;
  text: string;
  image?: string;
  entity?: FacilityDataType;
};

export const tutorialSteps = [
  {
    name: "intro",
    text: "Let's start by building a Gravity Hill",
    inventory: [EntityData.facilities.gravityhill],
    requires: [EntityData.facilities.gravityhill],
    screens: [
      {
        name: "A world of floating cities",
        text: "In a realm where the vastness of the cosmos meets the dreams of mortals, floating cities known as Laputas drift amidst the stars, tethered only by the delicate dance of gravity and ambition.<br/><br/>As a visionary architect of this celestial expanse, you are tasked with weaving together resources, imagination, and the very essence of the universe, to sculpt a city that not only floats but thrives. Let the dance of construction and collaboration begin, for in this ballet of creation, every tile, every choice, and every alliance matters.<br/><br/>Welcome, builder of the skies, to a journey of wonder and infinite possibilities.",
        image: "scroll.webp",
      },
      {
        name: "Into the skies!",
        text: `Embark on the foundational step of your skyward journey: the Gravity Hill. This magnificent contraption is the beating heart of your floating haven, generating the essential force of gravity. Choose the Gravity Hill from your inventory, and place it to set the cornerstone of your ethereal city.<br/><br/>
        ${EntityData.facilities.gravityhill.description}`,
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
    requires: [EntityData.facilities.dynamo],
    screens: [
      {
        name: "Power it up",
        text: `As your floating city takes shape, energy becomes the lifeblood that keeps it alive and thriving. The Whirly Dynamo, with its spiraled elegance, is the key. This majestic device captures the whispers and roars of the cosmic breezes, converting them into the vital energy your city craves. Place it, and watch as it breathes life into your creations, illuminating the skies with its radiant aura.<br/><br/>
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
    requires: [EntityData.facilities.residence],
    screens: [
      {
        name: "A place to put your stuff",
        text: `With the basic infrastructure in place, it's time to craft a space of warmth, comfort, and belonging. The Residence stands as a beacon of hope and rest for the citizens of your city. As you construct these abodes, you're not just building structures; you're crafting homes, stories, and memories. Place them with care, and watch as life, laughter, and dreams fill the spaces within.<br/><br/>
        ${EntityData.facilities.residence.description}`,
        entity: EntityData.facilities.residence,
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
    requires: [EntityData.facilities.residence],
    screens: [
      {
        name: "Making money",
        text: `In the symphony of the skies, where gravity dances and dynamos sing, it's the heartbeat of the population that brings true prosperity. As the denizens of your floating city find their homes, they don't just live—they thrive, they dream, and they contribute. With every beat of life, with every shared story, the magic of LAPU starts to accumulate.<br/><br/>It's not just currency; it's a manifestation of hope, hard work, and harmony. Embrace this rhythm, for in this celestial economy, the wealth isn't just in coins but in the vibrant life that generates it.<br/><br/>`,
        image: `friends.webp`,
      },
    ],
  },
] as TutorialStep[];

export const hasRequiredFacilities = (
  tutorialStep: TutorialStep,
  playerData: PlayerData
) => {
  if (!tutorialStep) return false;
  if (!tutorialStep.requires) return true;
  return tutorialStep.requires.every((facilityType) => {
    return hasFacility(playerData, facilityType.entityTypeId);
  });
};
