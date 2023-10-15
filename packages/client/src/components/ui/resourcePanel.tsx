import { ResourceIcons, ResourceType } from "@/game/data/resources";
import { useStore } from "@/game/store";

import "./resourcePanel.css";
import { cn } from "@/lib/utils";

function ResourceItem({
  resourceType,
  amount,
}: {
  resourceType: ResourceType;
  amount: number;
}) {
  const {
    input: { building },
  } = useStore();
  const Icon = ResourceIcons[resourceType];
  const { costs } = building || {};
  const res = costs?.find((c) => c[0] === resourceType);

  // if (amount <= 0) return null;
  return (
    <div className="resource-item-wrapper">
      <div
        className={cn(
          "resource-item",
          amount <= 0 && "hide-resource",
          res && res[1] > amount && "too-expensive"
        )}
      >
        <Icon className="resource-icon mr-2" />
        <div className="resource-amount"> {amount || 0}</div>
      </div>
      <div className="resource-name"> {resourceType || "UNKNOWN"}</div>
    </div>
  );
}

function ResourcePanel() {
  const {
    player: { playerData },
  } = useStore();

  return (
    <div className="resource-panel">
      {Object.entries(playerData.resources).map(([type, amount], idx) => (
        <ResourceItem
          key={idx}
          resourceType={type as ResourceType}
          amount={amount}
        />
      ))}
    </div>
  );
}

export { ResourcePanel };
