import { formatEther as fe } from "viem";

export const formatEther = (wei: bigint, digits: bigint = 18n): string => {
    const remainder = wei % (10n ^ (18n - digits));
    return fe(wei - remainder);
};
