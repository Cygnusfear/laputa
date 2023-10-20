import { mudConfig, resolveTableId } from "@latticexyz/world/register";

export default mudConfig({
  tables: {
    Counter: {
      keySchema: {},
      valueSchema: "uint32",
    },
    GameSetting: {
      keySchema: {},
      valueSchema: {
        aDaiAddress: "address",
        defiPoolAddress: "address",
        daiAddress: "address",
        lapuVaultAddress: "address",
        totalRewarded: "uint256",
      },
    },
    Position: {
      valueSchema: {
        x: "int32",
        y: "int32",
        z: "int32",
      },
    },
    EntityCustomization: {
      valueSchema: {
        variant: "uint32",
        color: "string",
      },
    },
    Orientation: {
      valueSchema: {
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
      args: [resolveTableId("Position")],
    },
    {
      name: "KeysWithValueModule",
      root: true,
      args: [resolveTableId("Position")],
    },
  ],
});
