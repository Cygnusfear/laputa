import ModelData, { ModelDataType } from "./models";
import { ResourceType } from "./resources";

export type EntityDataType = {
  name: string;
  blurb: string;
  description: string;
  image: string;
  costs: [ResourceType, number][];
  produces: [ResourceType, number, number][];
  variants: ModelDataType[];
};

const EntityData = {
  facilities: {
    gravityhill: {
      name: "Gravity Hill",
      blurb: "Generates gravity",
      description: `The Levitobble Contraptum works on the principle of "Harmonious Disarray." It contains a meticulously arranged collection of misaligned gears, perpetually confused springs, and bewilderingly coiled wires, all managed by a flock of diligent, tiny mechanical hummingbirds, named the "Buzzwizzards". These birds, with their flapping wings, create a subtle, chaotic energy that, quite accidentally, disrupts the gravitational pull beneath it.`,
      image: "gravity.webp",
      costs: [["lapu", 500]],
      produces: [["gravity", 25, 1]],
      variants: [ModelData.doubleside00],
    },
    dynamo: {
      name: "Whirly Dynamo",
      blurb: "Generates power",
      description:
        "The Whirligig Dynamo is an awe-inspiring, spiraled contraption, eternally spinning, twirling, and cascading in the breezy stratosphere. It contains an enormous, spiraled windmill, capturing the gentlest of breezes and the mightiest of gales.",
      image: "engine.webp",
      costs: [["lapu", 200]],
      produces: [["power", 25, 1]],
      variants: [ModelData.engine00],
    },
    residence: {
      name: "Residence",
      blurb: "Common housing",
      description:
        "The Residence is a humble abode for the citizens of your city. It is a place of rest, relaxation, and rejuvenation. It is a place to call home.",
      image: "residence.webp",
      costs: [["lapu", 100]],
      produces: [["population", 5, 1]],
      variants: [ModelData.block00, ModelData.block01, ModelData.block02],
    },
  } as { [key: string]: EntityDataType },
} as const;

export type TEntityData = typeof EntityData;

export default EntityData;
