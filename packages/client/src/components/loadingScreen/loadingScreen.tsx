import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

import "./loadingScreen.css";

function LoadingScreen() {
  const [loading, setLoading] = useState(true);

  const fadeOut = () => {
    setLoading(false);
  };

  useEffect(() => {
    document.addEventListener("gameLoaded", () => {
      fadeOut();
    });

    return () => {
      document.removeEventListener("gameLoaded", () => {});
    };
  }, []);

  return (
    <div className={cn("loading-wrapper", !loading && "wrapper-animate")}>
      <div className={cn("loading-background", !loading && "fade-out")} />
      <div className={cn("game-title", !loading && "fade-out")}>LAPUTA</div>
    </div>
  );
}

export default LoadingScreen;
