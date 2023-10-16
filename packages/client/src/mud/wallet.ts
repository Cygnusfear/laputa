import { createBurnerAccount } from "@latticexyz/common";
import {
  Account,
  Chain,
  ClientConfig,
  createWalletClient,
  custom,
  // custom,
  Hex,
  toHex,
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

  // check for potential extension wallets
  if ("ethereum" in window) {
    return (await connectExtensionWallet(
      networkConfig,
      clientOptions
    )) as TWalletClient;
  }

  // if they haven't we consider this a new player and we create a burner wallet
  return await createBurnerWallet(networkConfig, clientOptions);
}

/**
 * Creates a burner wallet using the provided network configuration and client options.
 * @param {NetworkConfig} networkConfig - The network configuration object.
 * @param {ClientConfig} clientOptions - The client configuration object.
 * @returns {Promise<TWalletClient>} A promise that resolves to a wallet client.
 */
export async function createBurnerWallet(
  networkConfig: NetworkConfig,
  clientOptions: ClientConfig
) {
  /*
   * Create a temporary wallet and a viem client for it
   * (see https://viem.sh/docs/clients/wallet.html).
   */
  const account = await createBurnerAccount(networkConfig.privateKey as Hex);
  const walletClient = createWalletClient({
    account: account,
    ...clientOptions,
  });
  return walletClient as TWalletClient;
}

/**
 * Connects to an extension wallet with the specified network configuration and client options.
 * @param {NetworkConfig} networkConfig - The network configuration object.
 * @param {ClientConfig} clientOptions - The client configuration object.
 * @returns {Promise<TWalletClient>} A promise that resolves to a wallet client.
 * @throws {Error} If the wallet can't connect.
 */
export async function connectExtensionWallet(
  networkConfig: NetworkConfig,
  clientOptions: ClientConfig
) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const extensionWallet = (window as any).ethereum;
    if (extensionWallet.chainId !== toHex(networkConfig.chainId)) {
      try {
        // Do initial request (if chain exists in wallet)
        await extensionWallet.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: toHex(networkConfig.chain.id) }],
        });
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        // @ts-ignore
        if (switchError.code === 4902 || switchError.code === -32603) {
          try {
            // Add wallet to Extension Wallet
            console.log(networkConfig.chain.rpcUrls);
            await extensionWallet.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: toHex(networkConfig.chainId).toString(),
                  chainName: networkConfig.chain.name,
                  rpcUrls: [networkConfig.chain.rpcUrls.default.http[0]],
                  nativeCurrency: {
                    name: networkConfig.chain.nativeCurrency.name,
                    symbol: networkConfig.chain.nativeCurrency.symbol,
                    decimals: networkConfig.chain.nativeCurrency.decimals,
                  },
                },
              ],
            });
            await extensionWallet.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: toHex(networkConfig.chain.id) }],
            });
          } catch (addError) {
            console.error(addError);
          }
        }
      }
    }

    // Setting up the Viem client
    const walletClient = createWalletClient({
      ...clientOptions,
      transport: custom(extensionWallet),
    });
    const accounts = await walletClient.requestAddresses();

    // Eventually connect to the chain and return
    const connectToChain = () => {
      console.log(
        `Connected to extension wallet -> ChainID ${networkConfig.chainId}`
      );
      walletClient.account = {
        address: accounts[0] as Hex,
        type: "json-rpc",
      };
      return walletClient as TWalletClient;
    };

    if (extensionWallet.chainId === toHex(networkConfig.chainId)) {
      return connectToChain();
    } else {
      try {
        // Wait for the chain changed event before connecting otherwise it fails
        let chainChanged = false;
        extensionWallet.on("chainChanged", () => (chainChanged = true));

        // 💀 deathloop
        while (!chainChanged) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        return connectToChain();
      } catch (e) {
        throw new Error("Wallet does not have the correct ChainID");
      }
    }
  } catch (error) {
    console.error("Error connecting to extension wallet: ", error);
  }
}
