import { useEffect, useRef } from "react";
import { CameraControlsProps } from "@react-three/drei";
import * as holdEvent from "hold-event";

const useCameraMoveHook = (orbitRef: React.RefObject<CameraControlsProps>) => {
  const moveIntervals = useRef<Map<string, number>>(new Map());
  const eventFunctions = useRef<
    Map<string, { start: () => void; end: () => void }>
  >(new Map());
  const keyHolds = useRef<Map<string, holdEvent.KeyboardKeyHold>>(new Map());

  useEffect(() => {
    const keys = [
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "KeyW",
      "KeyS",
      "KeyA",
      "KeyD",
    ];
    const moveSpeed = 0.1;

    keys.forEach((key) => {
      // @ts-ignore
      const keyHold = new holdEvent.KeyboardKeyHold(key);
      keyHolds.current.set(key, keyHold);

      const move = () => {
        switch (key.toLowerCase()) {
          case "keyw":
          case "arrowup":
            // @ts-ignore
            orbitRef.current?.forward(moveSpeed, false);
            break;
          case "keys":
          case "arrowdown":
            // @ts-ignore
            orbitRef.current?.forward(-moveSpeed, false);
            break;
          case "keya":
          case "arrowleft":
            // @ts-ignore
            orbitRef.current?.truck(-moveSpeed, false);
            break;
          case "keyd":
          case "arrowright":
            // @ts-ignore
            orbitRef.current?.truck(moveSpeed, false);
            break;
        }
      };

      const startFunction = () => {
        move();
        const intervalId = window.setInterval(move, 1);
        moveIntervals.current.set(key, intervalId);
      };

      const endFunction = () => {
        const intervalId = moveIntervals.current.get(key);
        if (intervalId) {
          clearInterval(intervalId);
          moveIntervals.current.delete(key);
        }
      };

      keyHold.addEventListener(
        holdEvent.HOLD_EVENT_TYPE.HOLD_START,
        startFunction
      );
      keyHold.addEventListener(holdEvent.HOLD_EVENT_TYPE.HOLD_END, endFunction);

      eventFunctions.current.set(key, {
        start: startFunction,
        end: endFunction,
      });
    });

    const moveCurrent = moveIntervals.current;
    const eventCurrent = eventFunctions.current;
    const keyholdCurrent = keyHolds.current;

    return () => {
      console.log("Cleanup function called");

      moveCurrent.forEach((intervalId) => {
        clearInterval(intervalId);
      });
      moveCurrent.clear();

      keys.forEach((key) => {
        const { start, end } = eventCurrent.get(key)!;
        const keyHold = keyholdCurrent.get(key);
        if (keyHold) {
          keyHold.removeEventListener(
            holdEvent.HOLD_EVENT_TYPE.HOLD_START,
            start
          );
          keyHold.removeEventListener(holdEvent.HOLD_EVENT_TYPE.HOLD_END, end);
        }
      });

      eventCurrent.clear();
      keyholdCurrent.clear();
    };
  }, [orbitRef]);
};

export default useCameraMoveHook;
