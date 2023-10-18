import { getState } from "@/game/store";
import { Inventory } from "./inventory";
import { ResourcePanel } from "./resourcePanel";
import { Tutorial } from "./tutorialModal";

function GameUI() {
  const finishedTutorial = getState().player.playerData.finishedTutorial;

  return (
    <div className="interface">
      <Inventory />
      <ResourcePanel />
      {!finishedTutorial && <Tutorial />}
    </div>
  );
}

export default GameUI;
