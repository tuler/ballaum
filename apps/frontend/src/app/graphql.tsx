"use client";

import { FC, ReactNode } from "react";
import { Client, createClient, Provider } from "urql";
import { mapValues } from "lodash";
import { useNetwork } from "wagmi";

const urls: Record<number, string> = {
    5: "https://ballaum.goerli.rollups.staging.cartesi.io/graphql",
    31337: "http://localhost:4000/graphql",
};

const clients: Record<number, Client> = mapValues(urls, (url) =>
    createClient({
        url,
    })
);

type Props = {
    children: ReactNode;
};

export const GraphQLProvider: FC<Props> = ({ children }) => {
    const network = useNetwork();
    const client = network.chain ? clients[network.chain.id] : undefined;
    return client ? (
        <Provider value={client}>{children}</Provider>
    ) : (
        <>{children}</>
    );
};
