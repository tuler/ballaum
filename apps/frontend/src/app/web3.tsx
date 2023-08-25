"use client";

import "@rainbow-me/rainbowkit/styles.css";

import { FC, ReactNode } from "react";
import Image from "next/image";
import { createConfig, configureChains, WagmiConfig } from "wagmi";
import { Chain, foundry, sepolia } from "wagmi/chains";
import {
    AvatarComponent,
    getDefaultWallets,
    RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { publicProvider } from "@wagmi/core/providers/public";
import { infuraProvider } from "@wagmi/core/providers/infura";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

const CustomAvatar: AvatarComponent = ({ address, ensImage, size }) => {
    return ensImage ? (
        <Image
            src={ensImage}
            width={size}
            height={size}
            style={{ borderRadius: 999 }}
            alt={address}
        />
    ) : (
        <Jazzicon diameter={size} seed={jsNumberForAddress(address)} />
    );
};

// add hardhat only in development
let supportedChains: Chain[] = [sepolia];
if (process.env.NODE_ENV == "development") {
    supportedChains = [foundry, ...supportedChains];
}

const { chains, publicClient, webSocketPublicClient } = configureChains(
    supportedChains,
    [
        // infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_ID! }),
        publicProvider(),
    ],
);

const { connectors } = getDefaultWallets({
    appName: "SportsBeth",
    // projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
    projectId: "70dc80c337384c58e99dcf69796a856e",
    chains,
});

const config = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
    webSocketPublicClient,
});

type Props = {
    children: ReactNode;
};

export const Web3: FC<Props> = ({ children }) => {
    return (
        <WagmiConfig config={config}>
            <RainbowKitProvider chains={chains} avatar={CustomAvatar}>
                {children}
            </RainbowKitProvider>
        </WagmiConfig>
    );
};
