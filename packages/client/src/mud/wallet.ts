import { createBurnerAccount } from "@latticexyz/common";
import {
  Account,
  Chain,
  ClientConfig,
  createWalletClient,
  custom,
  // custom,
  Hex,
  // http,
  Transport,
  WalletClient,
} from "viem";
// import {
//   ComethWallet,
//   ConnectAdaptor,
//   SupportedNetworks,
//   ComethProvider,
// } from "@cometh/connect-sdk";
// import { toAccount } from "viem/accounts";

import { getNetworkConfig } from "./getNetworkConfig";
// import { sendTransaction } from "viem/actions";

type NetworkConfig = Awaited<ReturnType<typeof getNetworkConfig>>;
type TWalletClient = WalletClient<Transport, Chain, Account>;

export async function setupWallet(
  clientOptions: ClientConfig
): Promise<TWalletClient> {
  const networkConfig = await getNetworkConfig();
  // check if the user has previously connected with a wallet
  window.localStorage.removeItem("walletAddress");
  // const isPlayer = true; //window.localStorage.getItem("laputa-player");
  // const localStorageAddress = window.localStorage.getItem("walletAddress");

  // returning player, we will check for a Cometh wallet
  // if (isPlayer) {
  //   // if (isPlayer === "cometh") {
  //   const apiKey = import.meta.env.VITE_COMETH_API;
  //   const walletAdaptor = new ConnectAdaptor({
  //     chainId: SupportedNetworks.MUMBAI,
  //     apiKey,
  //   });
  //   const instance = new ComethWallet({
  //     authAdapter: walletAdaptor,
  //     apiKey,
  //   });

  //   if (localStorageAddress) {
  //     await instance.connect(localStorageAddress);
  //   } else {
  //     await instance.connect();
  //     const walletAddress = await instance.getAddress();
  //     window.localStorage.setItem("walletAddress", walletAddress);
  //     window.localStorage.setItem("laputa-player", "cometh");
  //   }
  //   const instanceProvider = new ComethProvider(instance);
  //   console.log(instanceProvider, instance);

  //   const walletClient = createWalletClient({
  //     ...clientOptions,
  //     transport: http(instance.getProvider().connection.url),
  //     account: toAccount({
  //       address: (await instance.getAddress()) as Hex,
  //       async signMessage({ message }) {
  //         console.log(message);
  //         return instance.signMessage(message); // signMessage({ message, privateKey })
  //       },
  //       async signTransaction(transaction, { serializer } = {}) {
  //         console.log(transaction);
  //         return instance.signTransaction(transaction);
  //       },
  //       // async signTypedData(typedData) {
  //       //   return instance.si({ ...typedData, privateKey })
  //       // },
  //     }),
  //   });
  //   return walletClient as TWalletClient;
  // }

  if ("ethereum" in window) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const extensionWallet = window.ethereum as any;
      const walletClient = createWalletClient({
        ...clientOptions,
        transport: custom(extensionWallet),
      });
      const accounts = await walletClient.requestAddresses();
      console.log(extensionWallet, walletClient);
      if (walletClient.chain!.id === networkConfig.chainId) {
        console.log(
          `Connected to extension wallet -> ChainID ${networkConfig.chainId}`
        );
        walletClient.account = {
          address: accounts[0] as Hex,
          type: "json-rpc",
        };
        return walletClient as TWalletClient;
      }
      console.error("Wallet does not have the correct ChainID");
    } catch (error) {
      console.error("Error connecting to extension wallet: ", error);
    }
  }

  // if they haven't we consider this a new player and we create a burner wallet
  const account = await createBurnerWallet(networkConfig);
  const walletClient = createWalletClient({
    account: account,
    ...clientOptions,
  });
  return walletClient as TWalletClient;
}

/**
 * Creates a burner wallet using the provided network configuration and client options.
 * @param {NetworkConfig} networkConfig - The network configuration object.
 * @param {ClientConfig} clientOptions - The client configuration object.
 * @returns {Promise<TWalletClient>} A promise that resolves to a wallet client.
 */
export async function createBurnerWallet(networkConfig: NetworkConfig) {
  /*
   * Create a temporary wallet and a viem client for it
   * (see https://viem.sh/docs/clients/wallet.html).
   */

  return createBurnerAccount(networkConfig.privateKey as Hex);
}
