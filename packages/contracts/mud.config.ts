import { mudConfig, resolveTableId } from "@latticexyz/world/register";

export default mudConfig({
  tables: {
    Counter: {
      keySchema: {},
      valueSchema: "uint32",
    },
    Position: {
      valueSchema: {
        x: "int32",
        y: "int32",
        z: "int32",
        yaw: "int32",
      },
    },
    EntityType: {
      valueSchema: {
        typeId: "uint32",
      },
    },
    OwnedBy: {
      valueSchema: {
        owner: "address",
      },
    },
  },
  modules: [
    {
      name: "KeysInTableModule",
      root: true,
      args: [resolveTableId("Position"), resolveTableId("EntityType")],
    },
    {
      name: "KeysWithValueModule",
      root: true,
      args: [resolveTableId("Position"), resolveTableId("EntityType")],
    },
  ],  
});
