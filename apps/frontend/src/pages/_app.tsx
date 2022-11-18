import "../../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { chain, createClient, WagmiConfig } from "wagmi";
import { ConnectKitProvider, getDefaultClient } from "connectkit";

const infuraId = process.env.NEXT_PUBLIC_INFURA_ID;

const client = createClient(
    getDefaultClient({
        appName: "Bolão da Copa - Cartesi",
        chains: [chain.hardhat, chain.goerli],
        infuraId,
    })
);

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ChakraProvider>
            <WagmiConfig client={client}>
                <ConnectKitProvider>
                    <Component {...pageProps} />
                </ConnectKitProvider>
            </WagmiConfig>
        </ChakraProvider>
    );
}
