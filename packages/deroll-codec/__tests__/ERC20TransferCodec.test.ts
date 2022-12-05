import { describe, expect, test } from "@jest/globals";
import { BigNumber } from "@ethersproject/bignumber";
import { AddressZero } from "@ethersproject/constants";

import { ERC20TransferCodec } from "../src";

describe("ERC20TransferCodec", () => {
    test("correct", () => {
        const values: any[] = [
            AddressZero,
            AddressZero,
            BigNumber.from(1),
            "0x",
        ];
        expect(
            ERC20TransferCodec.decode(ERC20TransferCodec.encode(values))
        ).toEqual(values);
    });

    test("incorrect-", () => {
        const values: any[] = [AddressZero, AddressZero, BigNumber.from(1)];
        expect(() =>
            ERC20TransferCodec.decode(ERC20TransferCodec.encode(values))
        ).toThrow();
    });

    test("incorrect+", () => {
        const values: any[] = [
            AddressZero,
            AddressZero,
            BigNumber.from(1),
            "0x",
            1,
        ];
        expect(() =>
            ERC20TransferCodec.decode(ERC20TransferCodec.encode(values))
        ).toThrow();
    });
});
