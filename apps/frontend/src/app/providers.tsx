"use client";

import { FC, ReactNode } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { SWRConfig, SWRConfiguration } from "swr";

import { Web3 } from "./web3";
import { GraphQLProvider } from "./graphql";
import theme from "./theme";

const fetcher = async <JSON = any,>(
    input: RequestInfo,
    init?: RequestInit
): Promise<JSON> => {
    const res = await fetch(input, init);
    return res.json();
};

const swrConfig: SWRConfiguration = {
    fetcher: fetcher,
};

type Props = {
    children: ReactNode;
};

export const Providers: FC<Props> = ({ children }) => {
    return (
        <ChakraProvider theme={theme}>
            <Web3>
                <SWRConfig value={swrConfig}>
                    <GraphQLProvider>{children}</GraphQLProvider>
                </SWRConfig>
            </Web3>
        </ChakraProvider>
    );
};
