import { FC } from "react";
import { Text } from "@chakra-ui/react";
import { Address as Address_ } from "viem";

type AddressProps = {
    address?: Address_;
};

export const shortAddress = (
    address: Address_ | undefined,
    size: number = 8,
): string | undefined => {
    if (address) {
        size = Math.min(size, address.length);
        return `${address.slice(0, size / 2)}...${address.slice(-(size / 2))}`;
    }
    return undefined;
};

export const Address: FC<AddressProps> = ({ address }) => {
    return <Text>{shortAddress(address)}</Text>;
};
