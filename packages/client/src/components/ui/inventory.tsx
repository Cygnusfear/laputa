import EntityData, { EntityDataType } from "@/game/data/entities";
import "./inventory.css";
import { useStore } from "@/game/store";
import { ResourceIcons, ResourceType } from "@/game/data/resources";
import { cn } from "@/lib/utils";

function InventoryItem(props: EntityDataType) {
  const { name, blurb, image, produces, costs } = props;
  const {
    input: { cursor, setInput, building },
  } = useStore();

  const hideCursor = () => {
    cursor.setCursor({ cursorState: "hidden" });
  };

  const handleClick = () => {
    if (building === props) setInput({ building: undefined });
    else setInput({ building: props });
  };

  return (
    <div
      className={cn("card", building === props && "selected-item")}
      onMouseOver={hideCursor}
      onMouseEnter={hideCursor}
      onClick={handleClick}
    >
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
          {Object.entries(produces).map(([key, value]) => {
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
      </div>
    </div>
  );
}

function Inventory() {
  return (
    <div className="inventory-bar">
      {Object.entries(EntityData.facilities).map(([, entityData], idx) => (
        <InventoryItem key={idx} {...entityData} />
      ))}
    </div>
  );
}

export { InventoryItem, Inventory };
