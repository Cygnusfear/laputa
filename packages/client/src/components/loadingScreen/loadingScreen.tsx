import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

import "./loadingScreen.css";
import { useMUD } from "@/useMUD";
import { useComponentValue } from "@latticexyz/react";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import { SyncStep } from "@latticexyz/store-sync";

function LoadingScreen() {
  const [hide, setHide] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const {
    network: {
      components: { SyncProgress },
    },
  } = useMUD();

  const syncProgress = useComponentValue(SyncProgress, singletonEntity, {
    message: "Connecting",
    percentage: 0,
    step: SyncStep.INITIALIZE,
    latestBlockNumber: 0n,
    lastBlockNumberProcessed: 0n,
  });

  useEffect(() => {
    setProgress(syncProgress.percentage);
    if (syncProgress.percentage >= 100) {
      setHide(true);
      setLoading(false);
    }
  }, [syncProgress]);

  if (hide) return null;
  return (
    <div className={cn("loading-wrapper", !loading && "wrapper-animate")}>
      <div className={cn("loading-background", !loading && "fade-out")} />
      <div className={cn("loading-container", !loading && "fade-out")}>
        <div className="synthwave-lines" />
      </div>
      <div className={cn("game-title fade-in", !loading && "fade-out")}>
        <div className=" font-anton tracking-wide">LAPUTA</div>
        <div
          className="loading-bar mx-auto mt-0.5 block h-2.5 bg-white"
          style={{ width: `${progress}%` }}
        />
        <div className="loading-text mt-20 block text-center font-sans text-xs text-white">
          {syncProgress.message}{" "}
          {syncProgress.percentage > 0 && (
            <>{syncProgress.percentage.toFixed(2) + "%"}</>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
