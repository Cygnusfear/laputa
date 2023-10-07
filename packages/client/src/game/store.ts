import { RefObject } from "react";
import { PointOctree } from "sparse-octree";
import { Mesh, Object3D, Vector3 } from "three";
import { create } from "zustand";

export interface Entity {
  position: Vector3;
  scale: Vector3;
  rotation: Vector3;
  entityRef: RefObject<Object3D | Mesh>;
  colorPrimary: string;
  colorSecondary: string;
}

export interface Facility extends Entity {}

export interface World {
  entities: Entity[];
  octree: PointOctree<Entity>;
  addEntity: (entity: Entity) => void;
  removeEntity: (entity: Entity) => void;
  getEntityByRef: (ref: RefObject<Object3D | Mesh>) => Entity | undefined;
  getEntityByPosition: (position: Vector3) => Entity | undefined;
}

export type CursorState = "valid" | "invalid" | "hidden";

export interface CursorProps {
  position: Vector3;
  cursorState: CursorState;
  object: Object3D | Mesh | undefined;
  setCursor: (props: Partial<CursorProps>) => void;
}

export interface Input {
  cursor: CursorProps;
}

export interface IState {
  world: World;
  input: Input;
}

const octreeScale = 1000;
const min = new Vector3(-octreeScale, -octreeScale, -octreeScale);
const max = new Vector3(octreeScale, octreeScale, octreeScale);
const octree = new PointOctree<Entity>(min, max);

const useStore = create<IState>((set, get) => ({
  input: {
    cursor: {
      position: new Vector3(),
      cursorState: "valid",
      object: undefined,
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
}));

const { getState, setState } = useStore;
export { getState, setState, useStore };
