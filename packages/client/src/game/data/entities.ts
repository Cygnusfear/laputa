import ModelData from "./models";

const EntityData = {
  facilities: {
    gravityhill: {
      name: "Gravity Hill",
      description: "Generates gravity",
      longText: `The Levitobble Contraptum works on the principle of "Harmonious Disarray." It contains a meticulously arranged collection of misaligned gears, perpetually confused springs, and bewilderingly coiled wires, all managed by a flock of diligent, tiny mechanical hummingbirds, named the "Buzzwizzards". These birds, with their flapping wings, create a subtle, chaotic energy that, quite accidentally, disrupts the gravitational pull beneath it.`,
      image: "gravity.webp",
      costs: [{ type: "LAPU", amount: 500 }],
      produces: [{ gravity: 25, ticks: 1 }],
      variants: [ModelData.doubleside00],
    },
  },
  dynamo: {
    title: "Whirly Dynamo",
    description: "Generates power",
    longText:
      "The Whirligig Dynamo is an awe-inspiring, spiraled contraption, eternally spinning, twirling, and cascading in the breezy stratosphere. It contains an enormous, spiraled windmill, capturing the gentlest of breezes and the mightiest of gales.",
    image: "engine.webp",
    costs: [{ type: "LAPU", amount: 100 }],
    produces: [{ power: 5, ticks: 1 }],
    variants: [ModelData.engine00],
  },
  residence: {
    title: "Residence",
    description: "Common housing",
    longText:
      "The Residence is a humble abode for the citizens of your city. It is a place of rest, relaxation, and rejuvenation. It is a place to call home.",
    image: "residence.webp",
    costs: [{ type: "LAPU", amount: 100 }],
    produces: [{ population: 4, ticks: 1 }],
    variants: [ModelData.block00, ModelData.block01, ModelData.block02],
  },
};

export default EntityData;
