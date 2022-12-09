"use client";

import "@rainbow-me/rainbowkit/styles.css";

import { FC, ReactNode } from "react";
import Image from "next/image";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { goerli, hardhat } from "wagmi/chains";
import {
    AvatarComponent,
    getDefaultWallets,
    RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { publicProvider } from "wagmi/providers/public";
import { infuraProvider } from "wagmi/providers/infura";
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
let supportedChains = [goerli];
if (process.env.NODE_ENV == "development") {
    supportedChains = [hardhat, ...supportedChains];
}

const { chains, provider } = configureChains(supportedChains, [
    infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_ID! }),
    publicProvider(),
]);

const { connectors } = getDefaultWallets({
    appName: "Bolão da Copa",
    chains,
});

const client = createClient({
    autoConnect: true,
    connectors,
    provider,
});

type Props = {
    children: ReactNode;
};

export const Web3: FC<Props> = ({ children }) => {
    return (
        <WagmiConfig client={client}>
            <RainbowKitProvider chains={chains} avatar={CustomAvatar}>
                {children}
            </RainbowKitProvider>
        </WagmiConfig>
    );
};
