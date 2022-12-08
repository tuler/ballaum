"use client";

import { HStack, Spacer } from "@chakra-ui/react";
import Image from "next/image";
import { FC } from "react";
import Wallet from "./Wallet";

const Header: FC = () => {
    return (
        <HStack w="80%" justifyContent="flex-end">
            <Image src="/title.svg" width={240} alt="logo" height={10} />
            <Spacer />
            <Wallet />
        </HStack>
    );
};

export default Header;
