import { PropsWithChildren, useState } from "react";
import {
  KeyboardControls,
  CameraControlsProps,
  KeyboardControlsEntry,
} from "@react-three/drei";

enum Controls {
  forward = "forward",
  back = "back",
  left = "left",
  right = "right",
}

function CameraMove({
  orbitRef,
  children,
}: {
  orbitRef: React.RefObject<CameraControlsProps>;
} & PropsWithChildren) {
  const [moveSpeed] = useState(1.5);

  const move = (name: string) => {
    switch (name) {
      case Controls.forward:
        // @ts-ignore
        orbitRef.current?.forward(moveSpeed, true);
        break;
      case Controls.back:
        // @ts-ignore
        orbitRef.current?.forward(-moveSpeed, true);
        break;
      case Controls.left:
        // @ts-ignore
        orbitRef.current?.truck(-moveSpeed, 0, true);
        break;
      case Controls.right:
        // @ts-ignore
        orbitRef.current?.truck(moveSpeed, 0, true);
        break;
    }
  };
  const map: KeyboardControlsEntry[] = [
    {
      name: Controls.forward,
      keys: ["ArrowUp", "KeyW"],
    },
    {
      name: Controls.back,
      keys: ["ArrowDown", "KeyS"],
    },
    {
      name: Controls.left,
      keys: ["ArrowLeft", "KeyA"],
    },
    {
      name: Controls.right,
      keys: ["ArrowRight", "KeyD"],
    },
  ];

  return (
    <KeyboardControls
      map={map}
      onChange={(name) => {
        move(name);
      }}
    >
      {children}
    </KeyboardControls>
  );
}

export default CameraMove;
