import { Inventory } from "./inventory";
import { ResourcePanel } from "./resourcePanel";
import { Tutorial } from "./tutorialModal";

function GameUI() {
  return (
    <div className="interface">
      <Inventory />
      <ResourcePanel />
      <Tutorial />
    </div>
  );
}

export default GameUI;
