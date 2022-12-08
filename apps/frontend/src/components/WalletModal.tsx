import { ChangeEvent, FC, useState } from "react";
import {
    Button,
    FormControl,
    FormErrorMessage,
    HStack,
    Input,
    InputGroup,
    InputRightAddon,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    VStack,
} from "@chakra-ui/react";
import { BigNumber } from "@ethersproject/bignumber";
import { Zero } from "@ethersproject/constants";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { RxEnter, RxExit } from "react-icons/rx";
import { AccountBalance, AccountBalanceProps } from "./AccountBalance";
import { formatEther, parseEther } from "@ethersproject/units";

export type TransferProps = {
    user: AccountBalanceProps;
    dapp: AccountBalanceProps;
    operation: "deposit" | "withdraw";
    onSubmit: (value: BigNumber) => void;
};

const icons = {
    deposit: <ArrowForwardIcon fontSize="5xl" />,
    withdraw: <ArrowBackIcon fontSize="5xl" />,
};

export const Transfer: FC<TransferProps> = ({
    user,
    dapp,
    operation,
    onSubmit,
}) => {
    const [error, setError] = useState<string>();
    const [amount, setAmount] = useState<BigNumber>(Zero);

    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        try {
            const max = operation == "deposit" ? user.balance : dapp.balance;
            const value = parseEther(e.target.value);
            if (value.isNegative()) {
                setError("Invalid amount");
                setAmount(Zero);
            } else if (value.gt(max)) {
                setError(`Maximum amount is ${formatEther(max)} ETH`);
                setAmount(Zero);
            } else {
                setAmount(value);
                setError(undefined);
            }
        } catch (e) {
            setError("Invalid amount");
            setAmount(Zero);
        }
    };
    return (
        <VStack>
            <HStack
                spacing={5}
                align="baseline"
                w="100%"
                justify="space-around"
            >
                <AccountBalance {...user} />
                {icons[operation]}
                <AccountBalance {...dapp} />
            </HStack>
            <FormControl isInvalid={!!error}>
                <InputGroup>
                    <Input
                        placeholder="Enter amount"
                        onChange={handleAmountChange}
                    />
                    <InputRightAddon>ETH</InputRightAddon>
                </InputGroup>
                <FormErrorMessage>{error}</FormErrorMessage>
            </FormControl>
            <HStack w="100%">
                <Button
                    fontSize="sm"
                    variant="outline"
                    colorScheme="blue"
                    disabled={amount.isZero()}
                    w="100%"
                    onClick={() => amount.isZero() || onSubmit(amount)}
                >
                    Submit
                </Button>
            </HStack>
        </VStack>
    );
};

export type WalletProps = {
    user: AccountBalanceProps;
    dapp: AccountBalanceProps;
    onDeposit: (amount: BigNumber) => void;
    onWithdraw: (amount: BigNumber) => void;
};

export const WalletTabs: FC<WalletProps> = ({
    user,
    dapp,
    onDeposit,
    onWithdraw,
}) => {
    return (
        <Tabs isFitted variant="enclosed">
            <TabList>
                <Tab>
                    <VStack>
                        <RxEnter />
                        <Text>Deposit</Text>
                    </VStack>
                </Tab>
                <Tab>
                    <VStack>
                        <RxExit />
                        <Text>Withdraw</Text>
                    </VStack>
                </Tab>
            </TabList>
            <TabPanels>
                <TabPanel w="100%">
                    <Transfer
                        user={user}
                        dapp={dapp}
                        operation="deposit"
                        onSubmit={onDeposit}
                    />
                </TabPanel>
                <TabPanel>
                    <Transfer
                        user={user}
                        dapp={dapp}
                        operation="withdraw"
                        onSubmit={onWithdraw}
                    />
                </TabPanel>
            </TabPanels>
        </Tabs>
    );
};
