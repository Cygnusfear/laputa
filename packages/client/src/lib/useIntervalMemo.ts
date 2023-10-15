import { useState, useEffect } from "react";

/**
 * A hook that recalculates a value at regular intervals.
 *
 * @param {Function} fn - The function that computes the memoized value.
 * @param {number} delay - The interval delay in milliseconds.
 * @returns {any} - The computed value.
 */
function useIntervalMemo<T>(fn: () => T, delay: number): T {
  const [value, setValue] = useState(fn);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue(fn());
    }, delay);

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [fn, delay]);

  return value;
}

export { useIntervalMemo };
