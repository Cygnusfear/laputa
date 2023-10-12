import { useEffect, useRef } from "react";

function useOnce(fn: () => void) {
  const started = useRef(false);
  useEffect(() => {
    fn();

    return () => {
      started.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export { useOnce };
