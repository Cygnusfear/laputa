//import { useComponentValue } from "@latticexyz/react";
//import { singletonEntity } from "@latticexyz/store-sync/recs";
import LoadingScreen from "@/components/loadingScreen/loadingScreen";

import RootLayout from "./components/layout/layout";
import GameRoot from "./game/gameRoot";
//import { useMUD } from "./useMUD";

import { MudExample } from "./mudExample";

export const App = () => {
  return (
    <RootLayout>
      <GameRoot />
      <MudExample />
      <LoadingScreen />
    </RootLayout>
  );
};
