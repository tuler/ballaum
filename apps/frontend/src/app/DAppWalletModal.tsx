"use client";

import { FC, useState } from "react";
import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalOverlay,
} from "@chakra-ui/react";
import {
    EtherPortalFacet__factory,
    InputFacet__factory,
} from "@cartesi/rollups";
import {
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
} from "wagmi";
import { EtherWithdrawCodec } from "@deroll/codec";
import { BigNumber } from "@ethersproject/bignumber";
import { Zero } from "@ethersproject/constants";

import { Transfer } from "../components/WalletModal";
import { AccountBalanceProps } from "../components/AccountBalance";

type DAppWalletModalProps = {
    user: AccountBalanceProps;
    dapp: AccountBalanceProps;
    isOpen: boolean;
    onClose: () => void;
};

const DAppWalletModal: FC<DAppWalletModalProps> = ({
    user,
    dapp,
    isOpen,
    onClose,
}) => {
    const [amount, setAmount] = useState<BigNumber>(Zero);
    const depositPrep = usePrepareContractWrite({
        address: dapp.address,
        abi: EtherPortalFacet__factory.abi,
        functionName: "etherDeposit",
        args: ["0x"],
        overrides: {
            value: amount,
        },
    });
    const deposit = useContractWrite(depositPrep.config);
    const depositWait = useWaitForTransaction({ hash: deposit.data?.hash });

    const withdrawPrep = usePrepareContractWrite({
        address: dapp.address,
        abi: InputFacet__factory.abi,
        functionName: "addInput",
        args: [EtherWithdrawCodec.encode([amount])],
    });
    const withdraw = useContractWrite(withdrawPrep.config);
    const withdrawWait = useWaitForTransaction({ hash: withdraw.data?.hash });

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            motionPreset="slideInBottom"
            size="xl"
            isCentered
        >
            <ModalOverlay />
            <ModalContent bg="gray.50">
                <ModalCloseButton />
                <ModalBody m={5}>
                    <Transfer
                        user={user}
                        dapp={dapp}
                        isLoading={
                            depositWait.isLoading || withdrawWait.isLoading
                        }
                        onSubmit={(operation, v) => {
                            setAmount(v);
                            if (operation == "deposit") {
                                deposit.write?.();
                            } else if (operation == "withdraw") {
                                withdraw.write?.();
                            }
                        }}
                        onChange={(_operation, v) => {
                            setAmount(v);
                        }}
                    />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default DAppWalletModal;
