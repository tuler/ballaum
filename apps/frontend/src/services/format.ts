import { BigNumber } from "@ethersproject/bignumber";
import {
    commify as commify_,
    formatEther as formatEther_,
} from "@ethersproject/units";

export const formatEther = (
    wei: BigNumber,
    digits: number = 18,
    commify: boolean = false
): string => {
    const remainder = wei.mod(Math.pow(10, 18 - digits));
    const str = formatEther_(wei.sub(remainder));
    return commify ? commify_(str) : str;
};
