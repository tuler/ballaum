"use client";

import { useNetwork } from "wagmi";
import { useEffect, useState } from "react";

const contract: Record<number, `0x${string}`> = {
    5: "0xE6D220a982A668737E3782539892837071825ca1",
    31337: "0x142105FC8dA71191b3a13C738Ba0cF4BC33325e2",
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
