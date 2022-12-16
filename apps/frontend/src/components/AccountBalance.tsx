import { FC } from "react";
import { Text, useColorModeValue, VStack } from "@chakra-ui/react";
import { BigNumber } from "@ethersproject/bignumber";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { shortAddress } from "./address";
import { formatEther } from "../utils/format";

export type AccountBalanceProps = {
    address: `0x${string}`;
    balance: BigNumber;
    digits?: number;
    commify?: boolean;
};

export const AccountBalance: FC<AccountBalanceProps> = ({
    address,
    balance,
    digits = 18,
    commify = false,
}) => {
    const balanceColor = useColorModeValue("blackAlpha.500", "white");
    return (
        <VStack spacing={0}>
            <Jazzicon diameter={70} seed={jsNumberForAddress(address)} />
            <Text fontSize="lg" fontWeight="bold" pt={2}>
                {shortAddress(address)}
            </Text>
            <Text fontSize="sm" fontWeight="bold" color={balanceColor}>
                {formatEther(balance, digits, commify)} ETH
            </Text>
        </VStack>
    );
};
