import LoadingScreen from "@/components/loadingScreen/loadingScreen";

import RootLayout from "./components/layout/layout";
import GameRoot from "./game/gameRoot";

export const App = () => {
  return (
    <RootLayout>
      <GameRoot />
      <LoadingScreen />
    </RootLayout>
  );
};
