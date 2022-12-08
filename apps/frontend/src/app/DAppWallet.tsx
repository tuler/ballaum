"use client";

import { FC } from "react";
import { Button, Text } from "@chakra-ui/react";
import { Address } from "../components/address";
import { useInspect } from "../services/inspect";
import { useAccount } from "wagmi";
import { Wallet } from "ballaum-common";
import { formatEther, formatUnits } from "@ethersproject/units";

export type DAppWalletProps = {
    dapp?: string;
};

const DAppWallet: FC<DAppWalletProps> = ({ dapp }) => {
    const { address } = useAccount();
    const balance = useInspect<Wallet>(address ? `/wallets/${address}` : null);
    const l2Balance = formatEther(balance.report?.ether ?? "0");
    const chevron = (
        <svg
            fill="none"
            height="7"
            width="14"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M12.75 1.54001L8.51647 5.0038C7.77974 5.60658 6.72026 5.60658 5.98352 5.0038L1.75 1.54001"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                xmlns="http://www.w3.org/2000/svg"
            ></path>
        </svg>
    );
    return (
        <Button
            borderRadius="xl"
            shadow="md"
            rightIcon={chevron}
            _hover={{ transform: "scale(1.02)" }}
        >
            <Text fontWeight="bold">DApp: {l2Balance} ETH</Text>
        </Button>
    );
};

export default DAppWallet;
