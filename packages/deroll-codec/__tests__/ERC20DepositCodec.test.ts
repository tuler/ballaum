import { describe, expect, test } from "@jest/globals";
import { BigNumber } from "@ethersproject/bignumber";
import { AddressZero } from "@ethersproject/constants";

import { ERC20DepositCodec } from "../src";

describe("ERC20DepositCodec", () => {
    test("decode harcoded", () => {
        expect(
            ERC20DepositCodec.decode(
                "0x014ed7c70f96b99c776995fb64377f0d4ab3b0e1c1f39fd6e51aad88f6f4ce6ab8827279cfffb922660000000000000000000000000000000000000000000000000000000000000064"
            )
        ).toEqual([
            true,
            "0x4ed7c70f96b99c776995fb64377f0d4ab3b0e1c1",
            "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
            BigNumber.from(100),
            "0x",
        ]);
    });

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
