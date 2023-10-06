import { RefObject } from "react";
import { PointOctree } from "sparse-octree";
import { Mesh, Vector3 } from "three";
import { create } from "zustand";

export interface Entity {
  position: Vector3;
  scale: Vector3;
  rotation: Vector3;
  ref: RefObject<Mesh>;
}

export interface Facility extends Entity {}

export interface World {
  array: Entity[];
  octree: PointOctree<Entity>;
  addEntity: (entity: Entity) => void;
  removeEntity: (entity: Entity) => void;
  getEntityByRef: (ref: RefObject<Mesh>) => Entity | undefined;
  getEntityByPosition: (position: Vector3) => Entity | undefined;
}

export interface IState {
  world: World;
}

const octreeScale = 1000;
const min = new Vector3(-octreeScale, -octreeScale, -octreeScale);
const max = new Vector3(octreeScale, octreeScale, octreeScale);
const octree = new PointOctree<Entity>(min, max);

const useStore = create<IState>((set, get) => ({
  world: {
    array: [],
    octree,
    addEntity: (entity) => {
      get().world.octree.set(entity.position, entity);
      set((state) => ({
        world: {
          ...state.world,
          entities: [...state.world.array, entity],
        },
      }));
    },
    removeEntity: (entity) => {
      get().world.octree.remove(entity.position);
      set((state) => ({
        world: {
          ...state.world,
          entities: state.world.array.filter((e) => e !== entity),
        },
      }));
    },
    getEntityByRef: (ref) => {
      return get().world.array.find((e) => e.ref === ref);
    },
    getEntityByPosition: (position) => {
      return get().world.octree.get(position) || undefined;
    },
  },
}));

const { getState, setState } = useStore;
export { getState, setState, useStore };
