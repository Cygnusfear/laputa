export type ModelDataType = {
  name: string;
  nodes: string[];
  materials: string[];
  colors: string[];
};

export const importModels = [
  "/models/plants.glb",
  "/models/facilities.glb",
  "/models/resources.glb",
];
export const importTextures = ["/textures/box01.webp"];

const ModelData: { [key: string]: ModelDataType } = {
  block00: {
    name: "GenericBlock00",
    nodes: ["CubaBase", "Block02"],
    materials: ["Block.Material.001", "Block.Material.001"],
    colors: ["primary", "primary"],
  },
  block01: {
    name: "GenericBlock01",
    nodes: ["CubaBase", "Block02"],
    materials: ["Block.Material.001", "Block.Material.001"],
    colors: ["primary", "secondary"],
  },
  block02: {
    name: "GenericBlock02",
    nodes: ["CubaBase", "Block01"],
    materials: ["Block.Material.001", "Block.Material.001"],
    colors: ["primary", "primary"],
  },
  residence00: {
    name: "Residence00",
    nodes: ["CubaMid000", "CubaTop000"],
    materials: [],
    colors: ["secondary", "primary"],
  },
  residence01: {
    name: "Residence00",
    nodes: ["CubaMid000", "CubaTop001"],
    materials: [],
    colors: ["secondary", "primary"],
  },
  residence02: {
    name: "Residence00",
    nodes: ["CubaMid000", "CubaTop001", "CubaBottom000"],
    materials: [],
    colors: ["secondary", "primary", "primary"],
  },
  residence03: {
    name: "Residence00",
    nodes: ["CubaMid001", "CubaTop001", "CubaBottom000"],
    materials: [],
    colors: ["secondary", "primary", "primary"],
  },
  residence04: {
    name: "Residence00",
    nodes: ["CubaMid002", "CubaTop001", "CubaBottom000"],
    materials: [],
    colors: ["secondary", "primary", "primary"],
  },
  engine00: {
    name: "Engine00",
    nodes: ["dynamo00", "dynamo00001"],
    materials: [],
    colors: ["secondary", "primary"],
  },
  doubleside00: {
    name: "DoubleSide00",
    nodes: ["Double000", "Double001"],
    materials: [],
    colors: ["secondary", "primary"],
  },
  well00: {
    name: "Well00",
    nodes: ["Well00", "Well00001"],
    materials: ["Well"],
    colors: ["secondary", "primary"],
  },
  crystal00: {
    name: "Crystal000",
    nodes: ["Crystal000"],
    materials: ["MAT_crystal"],
    colors: [],
  },
  crystal01: {
    name: "Crystal001",
    nodes: ["Crystal001"],
    materials: ["MAT_crystal"],
    colors: [],
  },
  crystal02: {
    name: "Crystal002",
    nodes: ["Crystal002"],
    materials: ["MAT_crystal"],
    colors: [],
  },
  rock00: {
    name: "Rock000",
    nodes: ["Rock000"],
    materials: ["MAT_rock"],
    colors: [],
  },
} as const;

export type TModelData = typeof ModelData;

export default ModelData;
