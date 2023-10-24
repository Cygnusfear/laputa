import { ReactNode } from "react";
import ModelData, { ModelDataType } from "./models";
import { ResourceType } from "./resources";

export type DataType = {
  entityTypeId: number;
  name: string;
  blurb: string;
  description: string;
  image: string;
  produces: [ResourceType, number, number][];
  variants: ModelDataType[];
  tags: EntityTag[];
  renderers?: ReactNode[];
};

export type FacilityDataType = DataType & {
  costs: [ResourceType, number][];
};

export type ResourceDataType = DataType & {
  resourceType: ResourceType;
};

export const entityTags = [
  "groundLevel",
  "producesPower",
  "producesGravity",
  "producesPopulation",
  "hasWires",
  "hasPlants",
  "startingItem",
] as const;
export type EntityTag = (typeof entityTags)[number];

const EntityData = {
  facilities: {
    gravityhill: {
      entityTypeId: 1,
      name: "Gravity Hill",
      blurb: "Generates gravity",
      description: `The contraption works on the principle of "Harmonious Disarray." It contains a meticulously arranged collection of misaligned gears, perpetually confused springs, and bewilderingly coiled wires, all managed by a flock of diligent, tiny mechanical hummingbirds, named the "srIørk". These birds, with their flapping wings, create a subtle, chaotic energy that, quite accidentally, disrupts the gravitational pull beneath it.`,
      image: "gravity.webp",
      costs: [
        ["LAPU", 400],
        // ["crystal", 1],
      ],
      produces: [["gravity", 10, 1]],
      variants: ModelData.well,
      tags: ["groundLevel", "hasWires", "producesGravity", "startingItem"],
    },
    dynamo: {
      entityTypeId: 102,
      name: "Whirly Dynamo",
      blurb: "Generates power",
      description:
        "The Whirly Dynamo is an awe-inspiring, spiraled contraption, eternally spinning, twirling, and cascading in the breezy stratosphere. It contains an enormous, spiraled windmill, capturing the gentlest of breezes and the mightiest of gales.",
      image: "engine.webp",
      costs: [
        ["gravity", 2],
        ["LAPU", 300],
      ],
      produces: [["power", 6, 1]],
      variants: ModelData.engine,
      tags: ["hasWires"],
    },
    residence: {
      entityTypeId: 103,
      name: "Residence",
      blurb: "Common housing",
      description:
        "The Residence is a humble abode for the citizens of your city. It is a place of rest, relaxation, and rejuvenation. It is a place to call home.",
      image: "residence.webp",
      costs: [
        ["gravity", 1],
        ["power", 2],
        ["LAPU", 75],
      ],
      produces: [["population", 5, 1]],
      variants: ModelData.residence,
      tags: ["hasPlants"],
    },
    scaffold: {
      entityTypeId: 104,
      name: "Scaffold",
      blurb: "Metastructure",
      description: "",
      image: "scaffold.webp",
      costs: [
        ["gravity", 1],
        ["LAPU", 50],
      ],
      produces: [],
      variants: ModelData.scaffold,
      tags: [],
    },
    // miner: {
    //   entityTypeId: 105,
    //   name: "Crystal Miner",
    //   blurb: "Needs to be placed next to a Crystal",
    //   description: "",
    //   image: "scaffold.webp",
    //   costs: [
    //     ["gravity", 1],
    //     ["power", 2],
    //     ["LAPU", 350],
    //   ],
    //   produces: [],
    //   variants: ModelData.miner,
    //   tags: [],
    // },
  } as { [key: string]: FacilityDataType },
  resources: {
    crystalFloat: {
      entityTypeId: 701,
      name: "Floating Crystal",
      blurb: "A floating crystal",
      description:
        "A floating crystal. It is a crystal that floats. It is also a floating crystal.",
      image: "crystal.webp",
      resourceType: "crystal",
      produces: [["gravity", 25, 1]],
      variants: [...ModelData.rock, ...ModelData.crystal],
      tags: [],
    },
  } as { [key: string]: ResourceDataType },
} as const;

export type TEntityData = typeof EntityData;

export default EntityData;
