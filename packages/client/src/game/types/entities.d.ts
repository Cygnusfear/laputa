import { EntityDataType } from "../data/entities";

export interface IEntity {
  position: Vector3;
  scale: Vector3;
  rotation: Vector3;
  entityRef: RefObject<Object3D | Mesh>;
  createdTime: number;
}

export interface IFacility extends IEntity {
  type: EntityDataType;
  variant: ModelDataType;
  colorPrimary: string;
  colorSecondary: string;
}

export interface IResource extends IEntity {}
