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
    nodes: ["BlockBase", "Block02"],
    materials: ["Block.Material.001", "Block.Material.001"],
    colors: ["primary", "primary"],
  },
  block01: {
    name: "GenericBlock01",
    nodes: ["BlockBase", "Block02"],
    materials: ["Block.Material.001", "Block.Material.001"],
    colors: ["primary", "secondary"],
  },
  block02: {
    name: "GenericBlock02",
    nodes: ["BlockBase", "Block01"],
    materials: ["Block.Material.001", "Block.Material.001"],
    colors: ["primary", "primary"],
  },
  engine00: {
    name: "Engine00",
    nodes: ["dynamo00", "dynamo00001"],
    materials: [],
    colors: ["secondary", "primary"],
  },
  doubleside00: {
    name: "DoubleSide00",
    nodes: ["Double00", "Double00001"],
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
