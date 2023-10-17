import { Vector3 } from "three";
import { getState } from "../store";
import { createRef } from "react";
import { IResource } from "../types/entities";
import { ResourceDataType } from "../data/entities";
import prand from "pure-rand";

function ResourceFactory() {
  const {
    world: { addEntity, getEntityByPosition },
  } = getState();

  // Use time for seeded random
  const time = Date.now();
  const rng = prand.xoroshiro128plus(time);

  const randomEmptyPosition = () => {
    let attempts = 0;
    while (attempts < 300) {
      const x = Math.floor(Math.random() * 100 - 50);
      const y = Math.floor(Math.random() * 8) + 1;
      const z = Math.floor(Math.random() * 100 - 50);
      const position = new Vector3(x, y, z);
      const entity = getEntityByPosition(position);
      if (entity === undefined) {
        return position;
      }
      attempts++;
    }
    console.error("Could not find empty position for resource");
    return null;
  };

  const createResource = (resource: ResourceDataType, position: Vector3) => {
    console.log(position);
    const newResource: IResource = {
      seed: time,
      entityType: "resource",
      position: position,
      scale: new Vector3(1, 1, 1).multiplyScalar(Math.random() * 0.3 + 0.7),
      rotation: new Vector3(
        0,
        Math.PI * (Math.floor((Math.random() - 0.5) * 4) / 2),
        0
      ),
      type: resource,
      variant:
        resource.variants[
          prand.unsafeUniformIntDistribution(
            0,
            resource.variants.length - 1,
            rng
          )
        ],
      entityRef: createRef<THREE.Mesh>(),
      createdTime: time,
      gravity: 0,
    };

    const entityExists = getEntityByPosition(position);
    if (!entityExists) {
      addEntity(newResource);
    } else {
      console.error(
        "Could not create resource, entity already exists at position",
        position
      );
    }
  };

  return {
    createResource,
    randomEmptyPosition,
  };
}

export default ResourceFactory;
