import { FC } from "react";
import { Text } from "@chakra-ui/react";

type AddressProps = {
    address?: string;
};

export const Address: FC<AddressProps> = ({ address }) => {
    return (
        <Text>
            {address ? `${address.slice(0, 4)}...${address.slice(-4)}` : ""}
        </Text>
    );
};
