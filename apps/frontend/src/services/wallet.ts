import { useEffect, useState } from "react";
import { inspect } from "./inspect";
import { Wallet } from "ballaum-common";

export const useWallet = (address: string | undefined): Wallet | undefined => {
    const [wallet, setWallet] = useState<Wallet>();

    useEffect(() => {
        if (address) {
            inspect<Wallet>(`/wallet/${address}`).then((wallet) => {
                if (wallet) {
                    setWallet(wallet);
                }
            });
        }
    }, [address]);

    return wallet;
};
