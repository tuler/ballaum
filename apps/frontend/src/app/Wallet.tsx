"use client";

import { FC } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export type WalletProps = {};

const Wallet: FC<WalletProps> = () => {
    return <ConnectButton />;
};

export default Wallet;
