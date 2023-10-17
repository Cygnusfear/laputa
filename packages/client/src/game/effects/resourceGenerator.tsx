import React, { useEffect } from "react";
import { getState } from "../store";
import { ResourceType } from "../data/resources";

export type ResourceGeneratorProps = {
  interval: number;
  resources: { resource: ResourceType; amount: number }[];
  owner: string;
};

const ResourceGenerator: React.FC<ResourceGeneratorProps> = ({
  interval,
  resources,
  owner,
}) => {
  useEffect(() => {
    const { addResources, playerData } = getState().player;
    const intervalId = setInterval(() => {
      if (playerData.address === owner) addResources(resources);
    }, interval);

    return () => {
      clearInterval(intervalId);
    };
  }, [interval, resources, owner]);

  return null;
};

export { ResourceGenerator };
