import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { mergeNetworks } from '@dynamic-labs/sdk-react-core';

import Main from "./Main";

const evmNetworks = [
    {
        blockExplorerUrls: ["https://neonscan.org/"],
        chainId: 245022934,
        chainName: "Neon EVM Mainnet",
        iconUrls: ["https://s3.crypto-bonus.cointelegraph.com/wp-content/uploads/2024/09/neon.png"],
        name: "Neon",
        nativeCurrency: {
            decimals: 18,
            name: "NEON",
            symbol: "NEON",
        },
        networkId: 245022934,
        rpcUrls: ["https://neon-proxy-mainnet.solana.p2p.org"],
        vanityName: "Neon",
    }
];

const App = () => (
    <DynamicContextProvider
        settings={{
            environmentId: "b37ff02c-1dc3-470c-bd4b-6c110c143d51",
            overrides: {
                evmNetworks: (networks) => mergeNetworks(evmNetworks, networks),
            },
            walletConnectors: [EthereumWalletConnectors],
        }}
    >
        <Main />
    </DynamicContextProvider>
);

export default App;
