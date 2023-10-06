import React from "react";
import mudConfig from "contracts/mud.config";
import ReactDOM from "react-dom/client";

import { App } from "./App";
import { setup } from "./mud/setup";

import "@/styles/index.css";

import { MUDProvider } from "./MUDProvider";

const rootElement = document.getElementById("react-root");
if (!rootElement) throw new Error("React root not found");
const root = ReactDOM.createRoot(rootElement);

// TODO: figure out if we actually want this to be async or if we should render something else in the meantime
setup().then(async (result) => {
  root.render(
    <React.StrictMode>
      <MUDProvider value={result}>
        <App />
      </MUDProvider>
    </React.StrictMode>
  );

  // https://vitejs.dev/guide/env-and-mode.html
  if (import.meta.env.DEV) {
    const { mount: mountDevTools } = await import("@latticexyz/dev-tools");
    mountDevTools({
      config: mudConfig,
      publicClient: result.network.publicClient,
      walletClient: result.network.walletClient,
      latestBlock$: result.network.latestBlock$,
      storedBlockLogs$: result.network.storedBlockLogs$,
      worldAddress: result.network.worldContract.address,
      worldAbi: result.network.worldContract.abi,
      write$: result.network.write$,
      recsWorld: result.network.world,
    });
  }
});
