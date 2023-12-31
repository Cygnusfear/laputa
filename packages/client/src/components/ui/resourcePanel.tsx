import { useEffect, useState } from "react";
import { useSpring, animated, config } from "@react-spring/web";
import { ResourceIcons, ResourceType } from "@/game/data/resources";
import { useStore } from "@/game/store";

import "./resourcePanel.css";
import { cn } from "@/lib/utils";
import { FaFingerprint } from "react-icons/fa6";

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

  // Spring properties for animation
  const [animatedProps, setAnimatedProps] = useSpring(() => ({
    opacity: 1,
    fontSize: "1rem",
    transform: "scaleX(1)",
    config: config.gentle, // Adjust for desired animation feel
  }));

  useEffect(() => {
    // Trigger animation when amount changes
    setAnimatedProps({
      from: {
        opacity: 0.5,
        fontSize: "1rem",
        transform: "scaleX(1.5)",
      },
      to: {
        opacity: 1,
        fontSize: "1rem",
        transform: "scaleX(1)",
      },
    });
  }, [amount, setAnimatedProps]);

  return (
    <div className="resource-item-wrapper">
      <animated.div
        style={animatedProps}
        className={cn(
          "resource-item",
          amount <= 0 && "hide-resource",
          res && res[1] > amount && "too-expensive"
        )}
      >
        <Icon className="resource-icon mr-2" />
        <div className="resource-amount">{amount || 0}</div>
      </animated.div>
      <div className="resource-name"> {resourceType || "UNKNOWN"}</div>
    </div>
  );
}

function ResourcePanel() {
  const {
    player: {
      playerData,
      playerData: { hasComethWallet, LAPUtoBeConsolidated },
    },
  } = useStore();

  const [LAPUtemp, setLAPUtemp] = useState(0);

  useEffect(() => {
    setLAPUtemp(LAPUtoBeConsolidated || 0);
  }, [LAPUtoBeConsolidated]);

  return (
    <div className="resource-panel">
      {hasComethWallet !== "" && (
        <div className="mb-2 flex h-8 w-8 items-center rounded-[100%] border border-yellow-400 bg-slate-400">
          <FaFingerprint className="m-auto flex text-xl text-yellow-400" />
        </div>
      )}
      {Object.entries(playerData.resources)
        .filter(
          ([type]) => type !== "water" && type !== "food" && type !== "crystal"
        )
        .map(([type, amount], idx) => {
          const calcAmount = type === "LAPU" ? amount + LAPUtemp : amount;
          return (
            <ResourceItem
              key={idx}
              resourceType={type as ResourceType}
              amount={calcAmount}
            />
          );
        })}
      {/* <ResourceItem resourceType="LAPU" amount={LAPUtemp} /> */}
    </div>
  );
}

export { ResourcePanel };
