import { createContext } from "react";

import { SetupResult } from "./mud/setup";

export const MUDContext = createContext<SetupResult | null>(null);
