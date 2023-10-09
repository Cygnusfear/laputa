import { FacilityDataType, ResourceDataType } from "../data/entities";

export type EntityType = "facility" | "resource";

export interface IEntity {
  entityType: EntityType;
  position: Vector3;
  scale: Vector3;
  rotation: Vector3;
  entityRef: RefObject<Object3D | Mesh>;
  createdTime: number;
}

export interface IFacility extends IEntity {
  type: FacilityDataType;
  variant: ModelDataType;
  colorPrimary: string;
  colorSecondary: string;
}

export interface IResource extends IEntity {
  type: ResourceDataType;
  variant: ModelDataType;
}

export interface IResource extends IEntity {}
