import { useEffect, useState } from "react";
import { getState } from "../store";
import { Vector3 } from "three";
import GeneratedResource from "./generatedResource";
import { v4 as uuidv4 } from "uuid"; // Import UUID library

function FacilityEffectsRenderer() {
  // Change the state to hold an object with id and position
  const [randomspawn] = useState(false);
  const [coins, setCoins] = useState<{ id: string; position: Vector3 }[]>([]);

  useEffect(() => {
    if (!randomspawn) return;
    setCoins([]);
    const generateCoins = () => {
      const facilities = getState().world.entities.filter(
        (e) => e.entityType === "facility"
      );

      // Select random entities
      const indexrng = Math.floor(Math.random() * facilities.length);
      const randomEntities = facilities
        .sort(() => 0.5 - Math.random())
        .slice(indexrng, indexrng + 1);

      const newCoins = randomEntities.map((e) => {
        return {
          id: uuidv4(),
          position: new Vector3(e.position.x, e.position.y, e.position.z),
        };
      });

      setCoins((prevCoins) => [...prevCoins, ...newCoins]);
    };

    generateCoins();

    const interval = setInterval(() => {
      const randomInterval = Math.floor(Math.random() * 100) + 100;
      setTimeout(generateCoins, randomInterval);
    }, 100);

    return () => clearInterval(interval);
  }, [randomspawn]);

  const handleAnimationComplete = (id: string) => {
    setCoins((prevCoins) => prevCoins.filter((coin) => coin.id !== id));
  };

  return (
    <>
      {coins.map((coin) => (
        <GeneratedResource
          key={coin.id} // Use UUID as key
          id={coin.id} // Use UUID as key
          position={coin.position}
          onComplete={() => handleAnimationComplete(coin.id)} // Pass UUID to onComplete
        />
      ))}
    </>
  );
}

export default FacilityEffectsRenderer;
