"use client";

import { useNetwork } from "wagmi";
import { useEffect, useState } from "react";

const contract: Record<number, `0x${string}`> = {
    5: "0xb2C831D9803D62220E451C7026ef73A685d9646c",
    31337: "0xF8C694fd58360De278d5fF2276B7130Bfdc0192A",
};

export const useDAppAddress = (): `0x${string}` | undefined => {
    const network = useNetwork();
    const [address, setAddress] = useState<`0x${string}` | undefined>();
    useEffect(() => {
        if (network.chain) {
            setAddress(contract[network.chain.id]);
        } else {
            setAddress(undefined);
        }
    }, [network.chain]);
    return address;
};
