// app/providers.tsx
"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";

// Rainbow Kit and Wagmi Imports
import "@rainbow-me/rainbowkit/styles.css";
import {
  connectorsForWallets,
  getDefaultWallets,
  lightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { polygon, polygonMumbai } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

// Rainbow Kit and Wagmi Configurations
const { chains, publicClient } = configureChains(
  [polygon, polygonMumbai],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "" }),
    publicProvider(),
  ]
);

// const { connectors } = getDefaultWallets({
//   appName: "NFT Ticketing System",
//   projectId: process.env.NEXT_PUBLIC_PROJECT_ID || "",
//   chains,
// });

const connectors = connectorsForWallets([
  {
    groupName: '選擇使用錢包',
    wallets: [
      metaMaskWallet({ projectId: process.env.NEXT_PUBLIC_PROJECT_ID || "", chains }),
      // rainbowWallet({ projectId: process.env.NEXT_PUBLIC_PROJECT_ID || "", chains }),
      // walletConnectWallet({ projectId: process.env.NEXT_PUBLIC_PROJECT_ID || "", chains }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider>
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider
            theme={lightTheme({
              accentColor: "white",
              accentColorForeground: "purple",
              borderRadius: "large",
              fontStack: "system",
              overlayBlur: "small",
            })}
            chains={chains}
            initialChain={polygonMumbai}
          >
            {children}
          </RainbowKitProvider>
        </WagmiConfig>
      </ChakraProvider>
    </CacheProvider>
  );
}
