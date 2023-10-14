import { Instances } from "@react-three/drei";
import { useStore } from "../store";
import { useMemo } from "react";
import { IFacility } from "../types/entities";
import { PlantInstance } from "./plants/plantInstance";
import { VineInstance } from "./plants/vineInstance";

const limit = 200;

function Vegetation() {
  const {
    world: { entities },
    assets: { meshes, materials },
  } = useStore();

  const plantFacilities = useMemo(() => {
    return entities.filter(
      (e) =>
        e.entityType === "facility" &&
        (e as IFacility).type.tags.includes("hasPlants")
    ) as IFacility[];
  }, [entities]);

  const { mat, mesh } = useMemo(() => {
    if (!meshes["PlantsTop"]) return {};
    // @ts-ignore
    const map = meshes["PlantsTop"].material.map;
    const mat = materials["PlantsMat"];
    Object.assign(mat, {
      map: map,
      metalnessMap: map,
      emissiveMap: map,
    });
    const mesh = meshes["PlantsTop"].geometry;
    return { mat: mat, mesh: mesh };
  }, [materials, meshes]);

  return (
    <>
      <Instances limit={limit} range={1000} geometry={mesh} material={mat}>
        {plantFacilities.map((facility, idx) => {
          return (
            <>
              <PlantInstance key={idx + facility.createdTime} {...facility} />
              <VineInstance
                key={idx + facility.createdTime + "vine"}
                {...facility}
              />
            </>
          );
        })}
      </Instances>
    </>
  );
}

export { Vegetation };
