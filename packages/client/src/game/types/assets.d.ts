export interface Assets {
  meshes: Record<string, Mesh>;
  addMesh: (name: string, mesh: Mesh) => void;
  textures: Record<string, Texture>;
  addTexture: (name: string, texture: Texture) => void;
  materials: Record<string, Material>;
  addMaterial: (name: string, material: Material) => void;
}
