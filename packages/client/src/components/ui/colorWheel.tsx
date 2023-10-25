import { useState } from "react";
import Wheel from "@uiw/react-color-wheel";
import { ColorResult, hexToHsva } from "@uiw/color-convert";
import { getState } from "@/game/store";
import { getRandom } from "@/lib/utils";
import { palette } from "@/game/utils/palette";
import { animated, type SpringValue } from "@react-spring/web";

const randomColor = getRandom(palette.buildingSecondary);

function ColorWheel(props: {
  style: {
    opacity: SpringValue<number>;
    transform: SpringValue<string>;
  };
}) {
  const { style } = props;
  const [hsva, setHsva] = useState(hexToHsva(randomColor));
  const [hex, setHex] = useState(randomColor);

  const setColor = (color: ColorResult) => {
    setHex(color.hex);
    getState().input.cursor.setCursor({ color: color.hex });
    setHsva({ ...hsva, ...color.hsva });
  };

  return (
    <animated.div className="card m-2" style={style}>
      <div className="card-wrapper">
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
    </animated.div>
  );
}

export default ColorWheel;
