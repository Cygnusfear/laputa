import EntityData, { FacilityDataType } from "@/game/data/entities";
import "./inventory.css";
import { getState, useStore } from "@/game/store";
import { ResourceIcons, ResourceType } from "@/game/data/resources";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import {
  animated,
  config,
  useTransition,
  type SpringValue,
} from "@react-spring/web";
import { canAffordBuilding } from "@/game/systems/constructionSystem";
import ColorWheel from "./colorWheel";
import { tutorialSteps } from "@/game/data/tutorial";

function Inventory() {
  const {
    player: {
      playerData: { tutorialIndex, finishedTutorial },
    },
  } = useStore();
  const [facilities, setFacilities] = useState<FacilityDataType[]>([]);

  useEffect(() => {
    const loadInventoryItems = () => {
      if (!finishedTutorial && tutorialSteps[tutorialIndex]) {
        const f = Object.entries(EntityData.facilities)
          .map(([, entityData]) => entityData)
          .filter((entityData) =>
            tutorialSteps[tutorialIndex].inventory.includes(entityData)
          );
        setFacilities(f);
      } else {
        const f = Object.entries(EntityData.facilities).map(
          ([, entityData]) => entityData
        );
        setFacilities(f);
      }
    };

    loadInventoryItems();
  }, [finishedTutorial, tutorialIndex]);

  const listTransitions = useTransition(facilities, {
    config: config.gentle,
    from: { opacity: 1, transform: "translateX(250px) translateY(-5px)" },
    enter: () => [
      {
        opacity: 1,
        transform: "translateX(0px) translateY(0px)",
      },
    ],
    leave: { opacity: 0, height: 0, transform: "translateX(-250px)" },
    keys: facilities.map((_, index) => index),
  });

  return (
    <div className="inventory-bar">
      <ColorWheel />
      {listTransitions((styles, entityData) => (
        <InventoryItem {...entityData} style={styles} />
      ))}
    </div>
  );
}

function InventoryItem(
  props: FacilityDataType & {
    style: {
      opacity: SpringValue<number>;
      transform: SpringValue<string>;
    };
  }
) {
  const { name, blurb, image, produces, generates, costs, style } = props;
  const {
    input: { building },
  } = useStore();

  const tooExpensive = useMemo(() => !canAffordBuilding(props), [props]);

  const hideCursor = () => {
    getState().input.cursor.setCursor({ cursorState: "hidden" });
  };

  const handleClick = () => {
    const { setInput, cursor } = getState().input;
    if (building?.name === props.name) setInput({ building: undefined });
    else {
      setInput({ building: props });
      cursor.setCursor({ variant: 0 });
    }
  };

  return (
    <animated.div
      className={cn(
        "card",
        building?.name === props.name && "selected-item",
        tooExpensive && "too-expensive"
      )}
      onMouseOver={hideCursor}
      onMouseEnter={hideCursor}
      onClick={handleClick}
      style={style}
    >
      <animated.div className="card-wrapper">
        <div className="card-content">
          <div className="card-title">{name}</div>
          <div className="card-blurb">{blurb}</div>
        </div>
        <div className="card-portrait">
          <div
            className="card-image"
            style={{
              backgroundImage: `url(icons/${image})`,
            }}
          ></div>
          <div className="card-costs">
            {Object.entries(costs).map(([key, value]) => {
              const resource = value;
              const IconComponent = ResourceIcons[resource[0] as ResourceType];
              return (
                <div
                  key={key}
                  className="card-produces-item flex flex-row items-center"
                >
                  <span className="card-produces-item-value inline">
                    {resource[1]}
                  </span>
                  {IconComponent && (
                    <IconComponent className="ml-0.5 inline self-center" />
                  )}
                </div>
              );
            })}
          </div>
          <div className="card-produces">
            {produces &&
              Object.entries(produces).map(([key, value]) => {
                const resource = value;
                const IconComponent =
                  ResourceIcons[resource[0] as ResourceType];
                return (
                  <div
                    key={key}
                    className="card-produces-item flex flex-row items-center"
                  >
                    <span className="card-produces-item-value inline">
                      {resource[1]}
                    </span>
                    {IconComponent && (
                      <IconComponent className="ml-0.5 inline self-center" />
                    )}
                  </div>
                );
              })}
            {generates &&
              Object.entries(generates).map(([key, value]) => {
                const resource = value;
                const IconComponent =
                  ResourceIcons[resource[0] as ResourceType];
                return (
                  <div
                    key={key}
                    className="card-produces-item flex flex-row items-center"
                  >
                    <span className="card-produces-item-value inline">
                      {resource[1]}
                    </span>
                    {IconComponent && (
                      <IconComponent className="ml-0.5 inline self-center" />
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </animated.div>
    </animated.div>
  );
}

export { InventoryItem, Inventory };
