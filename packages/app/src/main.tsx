import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import {
  getDefaultWallets,
  RainbowKitProvider,
  connectorsForWallets,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import { injectedWallet } from "@rainbow-me/rainbowkit/wallets";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { gnosis } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient } = configureChains(
  [gnosis],
  [alchemyProvider({ apiKey: "process.env.ALCHEMY_ID" }), publicProvider()]
);
const { wallets } = getDefaultWallets({
  appName: "QFI",
  projectId: "YOUR_PROJECT_ID",
  chains,
});
const connectors = connectorsForWallets([
  {
    groupName: "Other",
    wallets: [injectedWallet({ chains })],
  },
  ...wallets,
]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
        showRecentTransactions={true}
        theme={lightTheme({
          accentColor: "#FFFFFF",
          accentColorForeground: "black",
          borderRadius: "medium",
          fontStack: "system",
          overlayBlur: "small",
        })}
      >
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);
