"use client";

import { FC } from "react";
import {
    Box,
    Button,
    HStack,
    Skeleton,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import { useAccount, useBalance } from "wagmi";
import { Wallet } from "ballaum-common";
import { BigNumber } from "@ethersproject/bignumber";
import { parseEther } from "@ethersproject/units";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

import { formatEther } from "../services/format";
import { useInspect } from "../services/inspect";
import DAppWalletModal from "./DAppWalletModal";
import { shortAddress } from "../components/address";

export type DAppWalletProps = {
    dapp: `0x${string}`;
};

export type DAppWalletComponentProps = {
    dapp: `0x${string}`;
    balance: BigNumber;
    onClick?: () => void;
};

export const DAppWalletComponent: FC<DAppWalletComponentProps> = ({
    balance,
    dapp,
    onClick,
}) => {
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
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                xmlns="http://www.w3.org/2000/svg"
            ></path>
        </svg>
    );

    return (
        <Button
            borderRadius="xl"
            shadow="md"
            variant="outline"
            p={1}
            _hover={{ transform: "scale(1.02)" }}
            onClick={onClick}
        >
            <HStack>
                <Text>{formatEther(balance, 4, true)} ETH</Text>
                <HStack bg="gray.100" p={1} borderRadius="lg">
                    <Jazzicon diameter={22} seed={jsNumberForAddress(dapp)} />
                    <Text>{shortAddress(dapp)}</Text>
                    {chevron}
                </HStack>
            </HStack>
        </Button>
    );
};

const DAppWallet: FC<DAppWalletProps> = ({ dapp }) => {
    const walletModal = useDisclosure();
    const { address } = useAccount();
    const { data: balance } = useBalance({ address });
    const dappWallet = useInspect<Wallet>(
        address ? `/wallet/${address}` : null
    );

    return (
        <>
            {dappWallet.report && (
                <DAppWalletComponent
                    dapp={dapp}
                    balance={parseEther(dappWallet.report?.ether)}
                    onClick={walletModal.onOpen}
                />
            )}
            {address && balance && dappWallet.report && (
                <DAppWalletModal
                    user={{ address, balance: balance.value }}
                    dapp={{
                        address: dapp,
                        balance: parseEther(dappWallet.report.ether),
                    }}
                    isOpen={walletModal.isOpen}
                    onClose={walletModal.onClose}
                />
            )}
        </>
    );
};

export default DAppWallet;
