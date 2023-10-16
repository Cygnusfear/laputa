import { Directions } from "@/lib/utils";
import { RefObject } from "react";
import { PointOctree } from "sparse-octree";
import { Mesh, Object3D, Vector3 } from "three";
import { create } from "zustand";
import { IEntity } from "./types/entities";
import { Assets } from "./utils/importer";
import { FacilityDataType } from "./data/entities";
import { DefaultMaterials, ResourceType } from "./data/resources";
import { PlayerData, createNewPlayerData } from "./data/player";

export interface World {
  entities: IEntity[];
  octree: PointOctree<IEntity>;
  addEntity: (entity: IEntity) => void;
  removeEntity: (entity: IEntity) => void;
  getEntityByRef: (ref: RefObject<Object3D | Mesh>) => IEntity | undefined;
  getEntityByPosition: (position: Vector3) => IEntity | undefined;
}

export type CursorState = "valid" | "invalid" | "hidden";
export interface CursorProps {
  position: Vector3;
  point: number[];
  cursorState: CursorState;
  object: Object3D | Mesh | undefined;
  direction: Vector3;
  color: string | undefined;
  setCursor: (props: Partial<CursorProps>) => void;
}

export type InputMode = "select" | "build" | "delete";
export interface Input {
  cursor: CursorProps;
  selection: IEntity | null;
  building: FacilityDataType | null;
  mode: InputMode;
  setInput: (props: Partial<Omit<Input, "cursor">>) => void;
}

export type IPlayer = {
  playerData: PlayerData;
  hasResources: (
    resources: { resource: ResourceType; amount: number }[]
  ) => boolean;
  spendResouces: (
    resources: { resource: ResourceType; amount: number }[]
  ) => void;
  addResources: (
    resources: { resource: ResourceType; amount: number }[]
  ) => void;
  setTutorialIndex: (step: number) => void;
};

export interface IState {
  world: World;
  input: Input;
  assets: Assets;
  player: IPlayer;
}

const octreeScale = 1000;
const min = new Vector3(-octreeScale, -octreeScale, -octreeScale);
const max = new Vector3(octreeScale, octreeScale, octreeScale);
const octree = new PointOctree<IEntity>(min, max);

const useStore = create<IState>((set, get) => ({
  player: {
    playerData: createNewPlayerData(),
    setTutorialIndex: (step) => {
      set((s) => ({
        player: {
          ...s.player,
          playerData: {
            ...s.player.playerData,
            tutorialIndex: step,
          },
        },
      }));
    },
    hasResources: (
      resources: { resource: ResourceType; amount: number }[]
    ): boolean => {
      return resources.every(({ resource, amount }) => {
        return get().player.playerData.resources[resource] >= amount;
      });
    },
    spendResouces: (
      resources: { resource: ResourceType; amount: number }[]
    ): void => {
      set((s) => ({
        player: {
          ...s.player,
          playerData: {
            ...s.player.playerData,
            resources: resources.reduce((acc, { resource, amount }) => {
              acc[resource] -= amount;
              return acc;
            }, s.player.playerData.resources),
          },
        },
      }));
    },
    addResources: (
      resources: { resource: ResourceType; amount: number }[]
    ): void => {
      set((s) => ({
        player: {
          ...s.player,
          playerData: {
            ...s.player.playerData,
            resources: resources.reduce((acc, { resource, amount }) => {
              acc[resource] += amount;
              return acc;
            }, s.player.playerData.resources),
          },
        },
      }));
    },
  },
  world: {
    entities: [],
    octree,
    addEntity: (entity) => {
      get().world.octree.set(entity.position, entity);
      set((state) => ({
        world: {
          ...state.world,
          entities: [...state.world.entities, entity],
        },
      }));
    },
    removeEntity: (entity) => {
      get().world.octree.remove(entity.position);
      set((state) => ({
        world: {
          ...state.world,
          entities: state.world.entities.filter((e) => e !== entity),
        },
      }));
    },
    getEntityByRef: (ref) => {
      return get().world.entities.find((e) => e.entityRef === ref);
    },
    getEntityByPosition: (position) => {
      return get().world.octree.get(position) || undefined;
    },
  },
  input: {
    mode: "select",
    selection: null,
    building: null,
    setInput: (props) => {
      set((state) => ({
        input: {
          ...state.input,
          ...props,
        },
      }));
    },
    cursor: {
      color: undefined,
      position: new Vector3(),
      point: [],
      cursorState: "valid",
      object: undefined,
      direction: Directions.UP(),
      setCursor: (props: Partial<CursorProps>) => {
        set((state) => ({
          input: {
            ...state.input,
            cursor: {
              ...state.input.cursor,
              ...props,
            },
          },
        }));
      },
    },
  },
  assets: {
    meshes: {},
    addMesh: (name, mesh) => {
      set((state) => ({
        assets: {
          ...state.assets,
          meshes: {
            ...state.assets.meshes,
            [name]: mesh,
          },
        },
      }));
    },
    textures: {},
    addTexture: (name, texture) => {
      set((state) => ({
        assets: {
          ...state.assets,
          textures: {
            ...state.assets.textures,
            [name]: texture,
          },
        },
      }));
    },
    materials: DefaultMaterials,
    addMaterial: (name, material) => {
      set((state) => ({
        assets: {
          ...state.assets,
          materials: {
            ...state.assets.materials,
            [name]: material,
          },
        },
      }));
    },
  },
}));

const { getState, setState } = useStore;
export { getState, setState, useStore };
