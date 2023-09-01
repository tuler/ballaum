"use client";

import { Center, HStack, Spacer } from "@chakra-ui/react";
import Link from "next/link";
import Image from "next/image";
import { FC } from "react";
import Wallet from "./Wallet";

const Header: FC = () => {
    return (
        <HStack w="80%" justifyContent="flex-end">
            <Link href="/">
                <Image
                    src="/libertadores.png"
                    width={140}
                    alt="logo"
                    height={10}
                />
            </Link>
            <Spacer />
            <Wallet />
        </HStack>
    );
};

export default Header;
