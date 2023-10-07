import EntityData, { EntityDataType } from "@/game/data/entities";
import "./inventory.css";
import { useStore } from "@/game/store";
import { ResourceIcons, ResourceType } from "@/game/data/resources";

function InventoryItem({
  name,
  blurb,
  image,
  produces,
  costs,
}: EntityDataType) {
  const { cursor } = useStore((state) => state.input);

  const hideCursor = () => {
    cursor.setCursor({ cursorState: "hidden" });
  };

  return (
    <div className="card" onMouseOver={hideCursor} onMouseEnter={hideCursor}>
      <div className="card-content">
        <div className="card-title">{name}</div>
        <div className="card-blurb">{blurb}</div>
      </div>
      <div
        className="card-image"
        style={{
          backgroundImage: `url(icons/${image})`,
        }}
      >
        <div className="card-price">
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
