"use client";

import { FC } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { HStack } from "@chakra-ui/react";
import DAppWallet from "./DAppWallet";
import { useDAppAddress } from "../services/contract";

export type WalletProps = {};

const Wallet: FC<WalletProps> = () => {
    const dapp = useDAppAddress();
    return (
        <HStack>
            <ConnectButton />
            {dapp && <DAppWallet dapp={dapp} />}
        </HStack>
    );
};

export default Wallet;
