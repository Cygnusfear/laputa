import { useState } from "react";
import Wheel from "@uiw/react-color-wheel";
import { ColorResult, hexToHsva } from "@uiw/color-convert";
import { useStore } from "@/game/store";
import { getRandom } from "@/lib/utils";
import { palette } from "@/game/utils/palette";

const randomColor = getRandom(palette.buildingSecondary);

function ColorWheel() {
  const [hsva, setHsva] = useState(hexToHsva(randomColor));
  const [hex, setHex] = useState(randomColor);
  const {
    input: {
      cursor: { setCursor },
    },
  } = useStore();

  const setColor = (color: ColorResult) => {
    console.log(color.hex);
    setHex(color.hex);
    setCursor({ color: color.hex });
    setHsva({ ...hsva, ...color.hsva });
  };

  return (
    <div className="card m-2">
      <div className=" card-wrapper">
        <div
          className="card-wheel flex items-center"
          style={{ backgroundColor: hex }}
        >
          <div className="mx-auto" style={{ width: "70px", height: "70px" }}>
            <Wheel
              color={hsva}
              onChange={setColor}
              className="flex"
              width={70}
              height={70}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ColorWheel;
