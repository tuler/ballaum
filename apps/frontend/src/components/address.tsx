import { FC } from "react";
import { Text } from "@chakra-ui/react";

type AddressProps = {
    address?: string;
};

export const shortAddress = (address: string | undefined): string | undefined =>
    address && address.length >= 8
        ? `${address.slice(0, 4)}...${address.slice(-4)}`
        : undefined;

export const Address: FC<AddressProps> = ({ address }) => {
    return <Text>{shortAddress(address)}</Text>;
};
