import { useContext } from "react";

import { MUDContext } from "./MUDContext";

export const useMUD = () => {
  const value = useContext(MUDContext);
  if (!value) throw new Error("Must be used within a MUDProvider");
  return value;
};
