import { FacilityDataType } from "@/game/data/entities";
import { cn } from "@/lib/utils";
import { FaRotateLeft, FaRotateRight } from "react-icons/fa6";
import { VscSymbolVariable } from "react-icons/vsc";
import { useSpring, animated, config } from "@react-spring/web";

function RotateUI({ building }: { building: FacilityDataType }) {
  const [rotateLeftProps, setRotateLeft] = useSpring(() => ({ scale: 1 }));
  const [variantProps, setVariant] = useSpring(() => ({ scale: 1 }));
  const [rotateRightProps, setRotateRight] = useSpring(() => ({ scale: 1 }));

  const handleRotateLeftClick = () => {
    setRotateLeft({ scale: 0.9, config: config.wobbly });
    setTimeout(() => {
      setRotateLeft({ scale: 1, config: config.wobbly });
    }, 50);
    const event = new Event("rotateLeft");
    document.dispatchEvent(event);
  };

  const handleVariantClick = () => {
    if (building.variants.length <= 1) return;
    setVariant({ scale: 0.9, config: config.wobbly });
    setTimeout(() => {
      setVariant({ scale: 1, config: config.wobbly });
    }, 50);
    const event = new Event("nextVariant");
    document.dispatchEvent(event);
  };

  const handleRotateRightClick = () => {
    setRotateRight({ scale: 0.9, config: config.wobbly });
    setTimeout(() => {
      setRotateRight({ scale: 1, config: config.wobbly });
    }, 50);
    const event = new Event("rotateRight");
    document.dispatchEvent(event);
  };

  return (
    <div className="building-bar">
      <animated.div style={rotateLeftProps}>
        <div className="rotate-button" onClick={handleRotateLeftClick}>
          <FaRotateLeft />
        </div>
      </animated.div>

      <animated.div style={variantProps}>
        <div
          className={cn(
            "variant-button",
            building.variants.length <= 1 && "disabled"
          )}
          onClick={handleVariantClick}
        >
          <VscSymbolVariable />
        </div>
      </animated.div>

      <animated.div style={rotateRightProps}>
        <div className="rotate-button" onClick={handleRotateRightClick}>
          <FaRotateRight />
        </div>
      </animated.div>
    </div>
  );
}

export { RotateUI };
