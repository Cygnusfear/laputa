import { ReactNode, useContext } from "react";

import { SetupResult } from "./mud/setup";
import { MUDContext } from "./MUDContext";

type Props = {
  children: ReactNode;
  value: SetupResult;
};

export const MUDProvider = ({ children, value }: Props) => {
  const currentValue = useContext(MUDContext);
  if (currentValue) throw new Error("MUDProvider can only be used once");
  return <MUDContext.Provider value={value}>{children}</MUDContext.Provider>;
};
