import React, { FC } from "react";
import {
    Alert,
    AlertDescription,
    AlertIcon,
    Button,
    HStack,
    Text,
    VStack,
} from "@chakra-ui/react";
import { utils } from "ethers";
import { useAccount, usePrepareContractWrite, useContractWrite } from "wagmi";
import { ConnectKitButton } from "connectkit";
import {
    EtherPortalFacet__factory,
    InputFacet__factory,
} from "@cartesi/rollups";
import { EtherWithdrawCodec } from "@deroll/codec";

import { useWallet } from "../services/wallet";
import { useEtherPortal } from "../services/contract";
import { parseEther } from "ethers/lib/utils.js";
import { Address } from "./address";

interface WalletComponentProps {
    dapp: string;
}

export const WalletComponent: FC<WalletComponentProps> = ({ dapp }) => {
    const { address, isConnected } = useAccount();
    const wallet = useWallet(address);
    const etherPortal = useEtherPortal(dapp);
    const amount = parseEther("0.01");

    const depositPrep = usePrepareContractWrite({
        address: dapp,
        abi: EtherPortalFacet__factory.abi,
        functionName: "etherDeposit",
        args: ["0x"],
        overrides: {
            value: amount,
        },
    });
    const deposit = useContractWrite(depositPrep.config);

    const withdrawPrep = usePrepareContractWrite({
        address: dapp,
        abi: InputFacet__factory.abi,
        functionName: "addInput",
        args: [EtherWithdrawCodec.encode([wallet?.ether ?? "0"])],
    });
    const withdraw = useContractWrite(withdrawPrep.config);

    return (
        <VStack>
            <HStack>
                {!isConnected && <ConnectKitButton />}
                {isConnected && wallet && (
                    <React.Fragment>
                        <Address address={address} />
                        <Text fontWeight="bold">
                            {utils.formatEther(wallet.ether)} ETH
                        </Text>
                    </React.Fragment>
                )}
            </HStack>
            <HStack>
                {etherPortal && (
                    <Button
                        colorScheme="purple"
                        disabled={!deposit.write}
                        onClick={() => deposit.write?.()}
                    >
                        Deposit
                    </Button>
                )}
                {wallet && (
                    <Button
                        colorScheme="purple"
                        onClick={() => withdraw.write?.()}
                        disabled={wallet.ether == "0"}
                    >
                        Withdraw
                    </Button>
                )}
            </HStack>
            <HStack>
                {depositPrep.error && (
                    <Alert status="error">
                        <AlertIcon />
                        <AlertDescription>
                            {depositPrep.error.message}
                        </AlertDescription>
                    </Alert>
                )}
                {withdrawPrep.error && (
                    <Alert status="error">
                        <AlertIcon />
                        <AlertDescription>
                            {withdrawPrep.error.message}
                        </AlertDescription>
                    </Alert>
                )}
            </HStack>
        </VStack>
    );
};
