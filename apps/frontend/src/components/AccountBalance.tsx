import { FC } from "react";
import { Text, useColorModeValue, VStack } from "@chakra-ui/react";
import { BigNumberish } from "@ethersproject/bignumber";
import { formatEther } from "@ethersproject/units";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { shortAddress } from "./address";

export type AccountBalanceProps = {
    address: `0x${string}`;
    balance: BigNumberish;
};

export const AccountBalance: FC<AccountBalanceProps> = ({
    address,
    balance,
}) => {
    const balanceColor = useColorModeValue("blackAlpha.500", "white");
    return (
        <VStack spacing={0}>
            <Jazzicon diameter={70} seed={jsNumberForAddress(address)} />
            <Text fontSize="lg" fontWeight="bold" pt={2}>
                {shortAddress(address)}
            </Text>
            <Text fontSize="sm" fontWeight="bold" color={balanceColor}>
                {formatEther(balance)} ETH
            </Text>
        </VStack>
    );
};
