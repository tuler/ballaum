"use client";

import { FC } from "react";
import {
    Button,
    HStack,
    Skeleton,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import { useInspect } from "../services/inspect";
import { useAccount, useBalance } from "wagmi";
import { Wallet } from "ballaum-common";
import { formatEther, parseEther } from "@ethersproject/units";
import DAppWalletModal from "./DAppWalletModal";

export type DAppWalletProps = {
    dapp: `0x${string}`;
};

const DAppWallet: FC<DAppWalletProps> = ({ dapp }) => {
    const walletModal = useDisclosure();
    const { address } = useAccount();
    const { data: balance } = useBalance({ address });
    const dappWallet = useInspect<Wallet>(
        address ? `/wallet/${address}` : null
    );
    const loadingWallet = !dappWallet.data && !dappWallet.error;

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
        <>
            <Button
                borderRadius="xl"
                shadow="md"
                variant="outline"
                rightIcon={chevron}
                _hover={{ transform: "scale(1.02)" }}
                onClick={walletModal.onOpen}
            >
                <HStack>
                    <Text fontWeight="bold">DApp:</Text>
                    {dappWallet.report && (
                        <Text>{formatEther(dappWallet.report.ether)} ETH</Text>
                    )}
                    {loadingWallet && <Skeleton h="20px" w="50px" />}
                </HStack>
            </Button>
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
