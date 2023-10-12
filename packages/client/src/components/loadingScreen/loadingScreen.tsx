import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useNProgress } from "@tanem/react-nprogress";

import "./loadingScreen.css";

function LoadingScreen() {
  const [hide, setHide] = useState(false);
  const [loading, setLoading] = useState(true);
  const { progress } = useNProgress({
    isAnimating: loading,
    animationDuration: 300,
    incrementDuration: 200,
    minimum: 0.1,
  });

  useEffect(() => {
    const fadeOut = () => {
      setLoading(false);
      setTimeout(() => {
        setHide(true);
      }, 5000);
    };

    document.addEventListener("gameLoaded", () => {
      fadeOut();
    });

    return () => {
      document.removeEventListener("gameLoaded", () => {});
    };
  }, []);

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
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}

export default LoadingScreen;
