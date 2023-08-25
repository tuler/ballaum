"use client";

import { FC, useState } from "react";
import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalOverlay,
} from "@chakra-ui/react";
import { useWaitForTransaction } from "wagmi";
import { encodeFunctionData, parseAbi } from "viem";
import {
    useEtherPortalDepositEther,
    useInputBoxAddInput,
    usePrepareEtherPortalDepositEther,
    usePrepareInputBoxAddInput,
} from "../hooks/rollups";

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
    const [amount, setAmount] = useState<bigint>(0n);
    const depositPrep = usePrepareEtherPortalDepositEther({
        args: [dapp.address, "0x"],
        value: amount,
    });
    const deposit = useEtherPortalDepositEther(depositPrep.config);
    const depositWait = useWaitForTransaction({ hash: deposit.data?.hash });

    const withdrawPrep = usePrepareInputBoxAddInput({
        args: [
            dapp.address,
            encodeFunctionData({
                abi: parseAbi(["function withdrawEther(uint256 amount)"]),
                functionName: "withdrawEther",
                args: [amount],
            }),
        ],
    });
    const withdraw = useInputBoxAddInput(withdrawPrep.config);
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
