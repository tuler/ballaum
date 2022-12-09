import { FC, ReactNode, useState } from "react";
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormErrorMessage,
    HStack,
    Input,
    InputGroup,
    InputRightAddon,
    Text,
    useColorModeValue,
    useRadio,
    useRadioGroup,
    UseRadioProps,
    VStack,
} from "@chakra-ui/react";
import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { MaxUint256, Zero } from "@ethersproject/constants";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { RxEnter, RxExit } from "react-icons/rx";
import { AccountBalance, AccountBalanceProps } from "./AccountBalance";
import { formatEther, parseEther } from "@ethersproject/units";

export type Operation = "deposit" | "withdraw";

type OperationRadioOptionProps = UseRadioProps & {
    children?: ReactNode;
};

const OperationRadioOption: FC<OperationRadioOptionProps> = (props) => {
    const { getInputProps, getCheckboxProps, state } = useRadio(props);
    const input = getInputProps();
    const checkbox = getCheckboxProps();

    const checkedStyle = useColorModeValue(
        { bg: "blue.500", color: "white" },
        { bg: "blue.500", color: "white" }
    );
    const hoverStyle = useColorModeValue(
        { bg: "gray.100" },
        { bg: "gray.100" }
    );

    return (
        <Box as="label">
            <input {...input} />
            <Flex
                justify="center"
                align="center"
                {...checkbox}
                h="60px"
                borderRadius={15}
                _checked={checkedStyle}
                w="140px"
                cursor="pointer"
                _hover={state.isChecked ? checkedStyle : hoverStyle}
            >
                {props.children}
            </Flex>
        </Box>
    );
};

type OperationRadioProps = {
    onChange: (value: "deposit" | "withdraw") => void;
};

const OperationRadio: FC<OperationRadioProps> = ({ onChange }) => {
    const { getRootProps, getRadioProps } = useRadioGroup({
        name: "operation",
        onChange,
    });

    const group = getRootProps();
    const deposit = getRadioProps({ value: "deposit" });
    const withdraw = getRadioProps({ value: "withdraw" });

    return (
        <VStack {...group}>
            <OperationRadioOption key="deposit" {...deposit}>
                <VStack spacing={0}>
                    <ArrowForwardIcon fontSize="xl" />
                    <Text fontWeight="bold">Deposit</Text>
                </VStack>
            </OperationRadioOption>
            <OperationRadioOption key="withdraw" {...withdraw}>
                <VStack spacing={0} justify="center">
                    <ArrowBackIcon fontSize="xl" />
                    <Text fontWeight="bold">Withdraw</Text>
                </VStack>
            </OperationRadioOption>
        </VStack>
    );
};

export type TransferProps = {
    user: AccountBalanceProps;
    dapp: AccountBalanceProps;
    isLoading: boolean;
    onChange?: (operation: Operation | undefined, value: BigNumber) => void;
    onSubmit: (operation: Operation, value: BigNumber) => void;
};

export const Transfer: FC<TransferProps> = ({
    user,
    dapp,
    onSubmit,
    onChange,
    isLoading,
}) => {
    const [operation, setOperation] = useState<"deposit" | "withdraw">();
    const [error, setError] = useState<string>();
    const [amountStr, setAmountStr] = useState<string>();
    const [amount, setAmount] = useState<BigNumber>(Zero);

    const set = (op: Operation | undefined, str: string | undefined) => {
        let value: BigNumber = Zero;
        let error: string | undefined = undefined;
        try {
            let max: BigNumberish = MaxUint256;
            if (op == "deposit") {
                max = user.balance;
            } else if (op == "withdraw") {
                max = dapp.balance;
            }
            if (str) {
                const v = parseEther(str);
                if (v.isNegative()) {
                    error = "Invalid amount";
                } else if (v.gt(max)) {
                    error = `Maximum amount is ${formatEther(max)} ETH`;
                } else {
                    value = v;
                }
            }
        } catch (e) {
            error = "Invalid amount";
        }
        setAmountStr(str);
        setOperation(op);
        setError(error);
        setAmount(value);
        if (onChange) {
            onChange(op, value);
        }
    };

    return (
        <VStack spacing={5}>
            <HStack spacing={5} w="100%" justify="space-around">
                <AccountBalance {...user} digits={4} />
                <OperationRadio onChange={(op) => set(op, amountStr)} />
                <AccountBalance {...dapp} digits={4} />
            </HStack>
            <HStack w="100%" align="start">
                <FormControl isInvalid={!!error}>
                    <InputGroup>
                        <Input
                            placeholder="Enter amount"
                            value={amountStr}
                            onChange={(e) => set(operation, e.target.value)}
                        />
                        <InputRightAddon>ETH</InputRightAddon>
                    </InputGroup>
                    <FormErrorMessage>{error}</FormErrorMessage>
                </FormControl>
                <Button
                    fontSize="sm"
                    colorScheme="blue"
                    loadingText="Sending..."
                    isLoading={isLoading}
                    disabled={amount.isZero() || !operation}
                    onClick={() =>
                        amount.isZero() || onSubmit(operation!, amount)
                    }
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
