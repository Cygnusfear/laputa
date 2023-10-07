import { RefObject, useCallback, useState } from "react";
import { ThreeEvent } from "@react-three/fiber";
import { Mesh, Object3D, Vector3 } from "three";

export type MouseInputEvent = {
  type: "click" | "hover";
  position: Vector3;
  object: THREE.Object3D;
};

export function useInput(
  callback?: (event: MouseInputEvent) => void,
  ref?: RefObject<Object3D | Mesh>
) {
  const [mouseDownPosition, setMouseDownPosition] = useState<
    [number, number] | null
  >(null);
  const [mousePosition, setMousePosition] = useState<
    [number, number, number] | null
  >(null);

  const getClosestPosition = (
    event: ThreeEvent<MouseEvent>,
    closest: THREE.Object3D
  ) =>
    closest.userData.type === "grid"
      ? event.point.clone().setY(0).floor().addScalar(0.5)
      : closest.getWorldPosition(new Vector3());

  const fireCallback = useCallback(
    (eventType: "click" | "hover", event: ThreeEvent<MouseEvent>) => {
      const closest = event.intersections?.[0]?.object;
      if (!closest) return;

      const pos = getClosestPosition(event, closest);
      if (!ref || ref.current === closest) {
        callback &&
          callback({ type: eventType, position: pos, object: closest });
      }
    },
    [callback, ref]
  );

  const onMouseMove = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      fireCallback("hover", event);
      setMousePosition(event.point.toArray());
    },
    [fireCallback]
  );

  const onMouseClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      if (!mouseDownPosition) return;

      const [downX, downY] = mouseDownPosition;
      if (
        Math.abs(event.clientX - downX) > 2 ||
        Math.abs(event.clientY - downY) > 2
      )
        return;

      event.stopPropagation();
      fireCallback("click", event);
      setMouseDownPosition([event.point.x, event.point.y]);
    },
    [fireCallback, mouseDownPosition]
  );

  const onMouseDown = useCallback(
    (event: ThreeEvent<MouseEvent>) =>
      setMouseDownPosition([event.clientX, event.clientY]),
    []
  );

  return {
    mouseDownPosition,
    mousePosition,
    onMouseDown,
    onMouseMove,
    onMouseClick,
  };
}
