import { FC } from "react";
import { HStack } from "@chakra-ui/react";
import Image from "next/image";

import { WalletComponent } from "./wallet";

interface HeaderProps {
    dapp: string;
}

export const Header: FC<HeaderProps> = ({ dapp }) => {
    return (
        <HStack>
            <Image src="/logo.svg" width={400} alt="logo" height={10} />
            <WalletComponent dapp={dapp} />
        </HStack>
    );
};
