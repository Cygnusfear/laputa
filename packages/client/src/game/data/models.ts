export type ModelDataType = {
  name: string;
  nodes: string[];
  materials: string[];
  colors: string[];
};

export type ModelDataGroupType = {
  [key: string]: ModelDataType[];
};

export const importModels = [
  "/models/plants.glb",
  "/models/facilities.glb",
  "/models/resources.glb",
];
const ModelData: ModelDataGroupType = {
  residence: [
    {
      name: "Residence00",
      nodes: ["CubaMid000", "CubaTop000"],
      materials: [],
      colors: ["secondary", "primary"],
    },
    {
      name: "Residence02",
      nodes: ["CubaMid000", "CubaTop001", "CubaBottom000"],
      materials: [],
      colors: ["secondary", "primary", "primary"],
    },
    {
      name: "Residence03",
      nodes: ["CubaMid001", "CubaTop000", "CubaBottom000", "CubaPole000"],
      materials: [],
      colors: ["secondary", "primary", "primary", "primary"],
    },
    {
      name: "Residence04",
      nodes: ["CubaMid002", "CubaTop001", "CubaBottom000"],
      materials: [],
      colors: ["secondary", "primary", "primary"],
    },
    {
      name: "Residence01",
      nodes: ["CubaMid000", "CubaTop001"],
      materials: [],
      colors: ["secondary", "primary"],
    },
    {
      name: "Residence05",
      nodes: ["CubaMid003", "CubaTop000", "CubaBottom000", "CubaPole001"],
      materials: [],
      colors: ["secondary", "primary", "primary", "primary"],
    },
    {
      name: "Residence05",
      nodes: ["CubaMid004", "CubaTop002", "CubaPole002"],
      materials: [],
      colors: ["secondary", "primary", "primary"],
    },
  ],
  engine: [
    {
      name: "Engine00",
      nodes: ["dynamo00", "dynamo00001"],
      materials: [],
      colors: ["secondary", "primary"],
    },
  ],
  well: [
    {
      name: "Well00",
      nodes: ["Well00", "Well00001"],
      materials: ["Well"],
      colors: ["secondary", "primary"],
    },
  ],
  scaffold: [
    {
      name: "Scaffold000",
      nodes: ["Scaffold000"],
      materials: [],
      colors: ["primary"],
    },
  ],
  crystal: [
    {
      name: "Crystal000",
      nodes: ["Crystal000"],
      materials: ["MAT_crystal"],
      colors: [],
    },
    {
      name: "Crystal001",
      nodes: ["Crystal001"],
      materials: ["MAT_crystal"],
      colors: [],
    },
    {
      name: "Crystal002",
      nodes: ["Crystal002"],
      materials: ["MAT_crystal"],
      colors: [],
    },
  ],
  rock: [
    {
      name: "Rock000",
      nodes: ["Rock000"],
      materials: ["MAT_rock"],
      colors: [],
    },
  ],
} as const;

export type TModelData = typeof ModelData;

export default ModelData;
