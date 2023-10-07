export interface IEntity {
  position: Vector3;
  scale: Vector3;
  rotation: Vector3;
  entityRef: RefObject<Object3D | Mesh>;
}

export interface IFacility extends IEntity {
  colorPrimary: string;
  colorSecondary: string;
}
