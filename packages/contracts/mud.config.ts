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
      },
    },
    Size: {
      valueSchema: {
        width: "uint32",
        length: "uint32",
        height: "uint32",
      },
    },
    Orientation: {
      valueSchema: {
        yaw: "uint32",
        pitch: "uint32",
        roll: "uint32",
      },
    },
    EntityType: {
      valueSchema: {
        typeId: "uint32",
      },
    },
  },
  modules: [
    {
      name: "KeysInTableModule",
      root: true,
      args: [resolveTableId("Position")],
    },
    {
      name: "KeysWithValueModule",
      root: true,
      args: [resolveTableId("Position")],
    },
  ],  
});
