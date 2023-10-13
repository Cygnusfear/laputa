import { GeneratorSound } from "../audio/generatorSound";
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
};

export type FacilityDataType = DataType & {
  costs: [ResourceType, number][];
  components?: (() => JSX.Element)[];
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
      costs: [["lapu", 500]],
      produces: [["gravity", 7, 1]],
      variants: [ModelData.well00],
      tags: ["groundLevel", "hasWires", "producesGravity", "startingItem"],
      components: [GeneratorSound],
    },
    dynamo: {
      entityTypeId: 102,
      name: "Whirly Dynamo",
      blurb: "Generates power",
      description:
        "The Whirly Dynamo is an awe-inspiring, spiraled contraption, eternally spinning, twirling, and cascading in the breezy stratosphere. It contains an enormous, spiraled windmill, capturing the gentlest of breezes and the mightiest of gales.",
      image: "engine.webp",
      costs: [["lapu", 200]],
      produces: [["power", 25, 1]],
      variants: [ModelData.engine00],
      tags: ["hasWires"],
      components: [],
    },
    residence: {
      entityTypeId: 103,
      name: "Residence",
      blurb: "Common housing",
      description:
        "The Residence is a humble abode for the citizens of your city. It is a place of rest, relaxation, and rejuvenation. It is a place to call home.",
      image: "residence.webp",
      costs: [["lapu", 100]],
      produces: [["population", 5, 1]],
      variants: [ModelData.block00, ModelData.block01, ModelData.block02],
      tags: [],
      components: [],
    },
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
      variants: [ModelData.rock00, ModelData.crystal01, ModelData.crystal02],
      tags: [],
    },
  } as { [key: string]: ResourceDataType },
} as const;

export type TEntityData = typeof EntityData;

export default EntityData;
