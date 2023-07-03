import { describe, expect, test } from "@jest/globals";
import { BigNumber } from "@ethersproject/bignumber";
import { AddressZero } from "@ethersproject/constants";

import { EtherDepositCodec } from "../src";

describe("EtherDepositCodec", () => {
    test("correct", () => {
        const values: any[] = [AddressZero, BigNumber.from(1), "0x"];
        expect(
            EtherDepositCodec.decode(EtherDepositCodec.encode(values))
        ).toEqual(values);
    });

    test("incorrect-", () => {
        const values: any[] = [AddressZero, BigNumber.from(1)];
        expect(() =>
            EtherDepositCodec.decode(EtherDepositCodec.encode(values))
        ).toThrow();
    });

    test("incorrect+", () => {
        const values: any[] = [AddressZero, BigNumber.from(1), "0x", 2];
        expect(() =>
            EtherDepositCodec.decode(EtherDepositCodec.encode(values))
        ).toThrow();
    });
});
