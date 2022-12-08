import { useInspect, UseInspect } from "./inspect";
import { Wallet } from "ballaum-common";

export const useWallet = (address: string | undefined): UseInspect<Wallet> => {
    return useInspect<Wallet>(`/wallet/${address}`);
};
