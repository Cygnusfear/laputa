/*
 * This file sets up all the definitions required for a MUD client.
 */

import { createClientComponents } from "./createClientComponents";
import { createSystemCalls } from "./createSystemCalls";
import { setupNetwork } from "./setupNetwork";

export type SetupResult = {
  network: Awaited<ReturnType<typeof setupNetwork>>;
  components: ReturnType<typeof createClientComponents>;
  systemCalls: ReturnType<typeof createSystemCalls>;
};

let mudSetup: SetupResult | null = null;

export async function setup() {
  if (mudSetup) {
    return mudSetup;
  }
  const network = await setupNetwork();
  const components = createClientComponents(network);
  const systemCalls = createSystemCalls(network, components);

  mudSetup = {
    network,
    components,
    systemCalls,
  };

  return mudSetup;
}

export async function getMUD() {
  if (mudSetup) {
    return mudSetup;
  }
  return await setup();
}
