"use client";

import { useEffect, useState } from "react";
import { Address } from "viem";
import { useNetwork } from "wagmi";

const contract: Record<number, `0x${string}`> = {
    11155111: "0xE6D220a982A668737E3782539892837071825ca1",
    31337: "0x70ac08179605AF2D9e75782b8DEcDD3c22aA4D0C",
};

export const useDAppAddress = (): Address | undefined => {
    const network = useNetwork();
    const [address, setAddress] = useState<Address | undefined>();
    useEffect(() => {
        if (network.chain) {
            setAddress(contract[network.chain.id]);
        } else {
            setAddress(undefined);
        }
    }, [network.chain]);
    return address;
};
