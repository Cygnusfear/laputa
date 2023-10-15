import { useEffect } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { Material, Mesh, Texture } from "three";
import type { GLTF } from "three-stdlib";
import { useStore } from "../store";
import { importModels } from "../data/models";
import { importTextures } from "../data/resources";

export interface Assets {
  meshes: Record<string, Mesh>;
  addMesh: (name: string, mesh: Mesh) => void;
  textures: Record<string, Texture>;
  addTexture: (name: string, texture: Texture) => void;
  materials: Record<string, Material>;
  addMaterial: (name: string, material: Material) => void;
}

function ModelLoader({ path }: { path: string }) {
  const { addMesh } = useStore((state) => state.assets);

  useEffect(() => {
    useGLTF.preload(path);
  }, [path]);

  // Loading and storing the model
  const model = useGLTF(path) as GLTF & {
    nodes: Record<string, Mesh>;
    materials: Record<string, Material>;
  };

  useEffect(() => {
    if (model) {
      Object.values(model.nodes).forEach((node) => {
        try {
          addMesh(node.name, node);
        } catch (error) {
          console.error(`Error adding model:${node.name}`, error);
        }
      });
    }
  }, [model, addMesh]);

  return null;
}

function TextureLoader({ path }: { path: string }) {
  const { addTexture } = useStore((state) => state.assets);

  useEffect(() => {
    useTexture.preload(path);
  }, [path]);

  // Loading and storing the texture
  const texture = useTexture(path) as Texture;

  useEffect(() => {
    if (texture) {
      importTextures.forEach((node) => {
        try {
          addTexture(node.replace("/textures/", "").split(".")[0], texture);
        } catch (error) {
          console.error(`Error adding texture: ${node}`, error);
        }
      });
    }
  }, [texture, addTexture]);

  return null;
}

function Importer() {
  return (
    <>
      {importModels.map((model) => (
        <ModelLoader key={model} path={model} />
      ))}
      {importTextures.map((texture) => (
        <TextureLoader key={texture} path={texture} />
      ))}
    </>
  );
}

export default Importer;
