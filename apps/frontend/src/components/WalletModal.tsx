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
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { AccountBalance, AccountBalanceProps } from "./AccountBalance";
import { formatEther, parseEther } from "viem";

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
        { bg: "blue.500", color: "white" },
    );
    const hoverStyle = useColorModeValue(
        { bg: "gray.100" },
        { bg: "gray.100" },
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
    onChange?: (operation: Operation | undefined, value: bigint) => void;
    onSubmit: (operation: Operation, value: bigint) => void;
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
    const [amountStr, setAmountStr] = useState<string>("");
    const [amount, setAmount] = useState<bigint>(0n);

    const set = (op: Operation | undefined, str: string | undefined) => {
        let value: bigint = 0n;
        let error: string | undefined = undefined;
        try {
            let max: bigint = 2n ^ 255n;
            if (op == "deposit") {
                max = user.balance;
            } else if (op == "withdraw") {
                max = dapp.balance;
            }
            if (str) {
                const v = parseEther(str);
                if (v < 0) {
                    error = "Invalid amount";
                } else if (v > max) {
                    error = `Maximum amount is ${formatEther(max)} ETH`;
                } else {
                    value = v;
                }
            }
        } catch (e) {
            error = "Invalid amount";
        }
        setAmountStr(str || "");
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
                <AccountBalance {...user} digits={4n} />
                <OperationRadio onChange={(op) => set(op, amountStr)} />
                <AccountBalance {...dapp} digits={4n} />
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
                    disabled={amount == 0n || !operation}
                    onClick={() => amount == 0n || onSubmit(operation!, amount)}
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
    onDeposit: (amount: bigint) => void;
    onWithdraw: (amount: bigint) => void;
};
