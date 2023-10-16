import { useState } from "react";
import Wheel from "@uiw/react-color-wheel";
import { ColorResult } from "@uiw/color-convert";
import { useStore } from "@/game/store";

function ColorWheel() {
  const [hsva, setHsva] = useState({ h: 214, s: 43, v: 90, a: 1 });
  const {
    input: {
      cursor: { setCursor },
    },
  } = useStore();

  const setColor = (color: ColorResult) => {
    console.log(color.hex);
    setCursor({ color: color.hex });
    setHsva({ ...hsva, ...color.hsva });
  };

  return (
    <div className="card">
      <div className="card-wheel flex items-center">
        <Wheel
          color={hsva}
          onChange={setColor}
          className=""
          width={70}
          height={70}
        />
      </div>
    </div>
  );
}

export default ColorWheel;
