import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

import "./loadingScreen.css";

let interval: NodeJS.Timeout,
  current_progress = 0,
  step = 0.1;

function LoadingScreen() {
  const [hide, setHide] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const fadeOut = () => {
    current_progress = 100;
    setLoading(false);
  };

  useEffect(() => {
    if (progress === 0) {
      interval = setInterval(function () {
        current_progress += step;
        const p =
          Math.round(
            (Math.atan(current_progress) / (Math.PI / 2)) * 100 * 1000
          ) / 1000;
        setProgress(p);
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setHide(true);
          }, 5000);
        } else if (progress >= 50) {
          step = 0.2;
        }
      }, 100);

      document.addEventListener("gameLoaded", () => {
        fadeOut();
        setProgress(100);
      });

      return () => {
        document.removeEventListener("gameLoaded", () => {});
      };
    }
  }, [progress]);

  if (hide) return null;
  return (
    <div className={cn("loading-wrapper", !loading && "wrapper-animate")}>
      <div className={cn("loading-background", !loading && "fade-out")} />
      <div className={cn("loading-container", !loading && "fade-out")}>
        <div className="synthwave-lines" />
      </div>
      <div
        className={cn(
          "game-title font-anton fade-in tracking-wide",
          !loading && "fade-out"
        )}
      >
        LAPUTA
        <div
          className="loading-bar mx-auto mt-0.5 block h-2.5 bg-white"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default LoadingScreen;
