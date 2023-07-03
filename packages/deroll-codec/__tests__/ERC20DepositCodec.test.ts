import { describe, expect, test } from "@jest/globals";
import { BigNumber } from "@ethersproject/bignumber";
import { AddressZero } from "@ethersproject/constants";

import { ERC20DepositCodec } from "../src";

describe("ERC20DepositCodec", () => {
    test("correct", () => {
        const values: any[] = [
            true,
            AddressZero,
            AddressZero,
            BigNumber.from(1),
            "0x",
        ];
        expect(
            ERC20DepositCodec.decode(ERC20DepositCodec.encode(values))
        ).toEqual(values);
    });

    test("incorrect-", () => {
        const values: any[] = [
            true,
            AddressZero,
            AddressZero,
            BigNumber.from(1),
        ];
        expect(() =>
            ERC20DepositCodec.decode(ERC20DepositCodec.encode(values))
        ).toThrow();
    });

    test("incorrect+", () => {
        const values: any[] = [
            true,
            AddressZero,
            AddressZero,
            BigNumber.from(1),
            "0x",
            1,
        ];
        expect(() =>
            ERC20DepositCodec.decode(ERC20DepositCodec.encode(values))
        ).toThrow();
    });
});
