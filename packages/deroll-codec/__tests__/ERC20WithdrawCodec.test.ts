import { describe, expect, test } from "@jest/globals";
import { BigNumber } from "@ethersproject/bignumber";
import { AddressZero } from "@ethersproject/constants";

import { ERC20WithdrawCodec } from "../src";

describe("ERC20WithdrawCodec", () => {
    test("correct", () => {
        const values: any[] = [AddressZero, BigNumber.from(1)];
        expect(
            ERC20WithdrawCodec.decode(ERC20WithdrawCodec.encode(values))
        ).toEqual(values);
    });

    test("incorrect-", () => {
        const values: any[] = [AddressZero];
        expect(() =>
            ERC20WithdrawCodec.decode(ERC20WithdrawCodec.encode(values))
        ).toThrow();
    });

    test("incorrect+", () => {
        const values: any[] = [AddressZero, BigNumber.from(1), 2];
        expect(() =>
            ERC20WithdrawCodec.decode(ERC20WithdrawCodec.encode(values))
        ).toThrow();
    });
});
