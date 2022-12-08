import { useNetwork } from "wagmi";
import { useMemo } from "react";

const contract: Record<number, string> = {
    5: "0xE8dc6065B256c14A4274498F75c57ba1b37e9659",
    31337: "0xF8C694fd58360De278d5fF2276B7130Bfdc0192A",
};

export const useDAppAddress = (): string | undefined => {
    const network = useNetwork();
    const memo = useMemo<string | undefined>(
        () => (network.chain ? contract[network.chain.id] : undefined),
        [network.chain]
    );
    return memo;
};
