import { Inventory } from "./inventory";
import { ResourcePanel } from "./resourcePanel";

function GameUI() {
  return (
    <div className="interface">
      <Inventory />
      <ResourcePanel />
    </div>
  );
}

export default GameUI;
