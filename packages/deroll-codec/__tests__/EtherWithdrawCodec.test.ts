import { describe, expect, test } from "@jest/globals";
import { BigNumber } from "@ethersproject/bignumber";

import { EtherWithdrawCodec } from "../src";

describe("EtherWithdrawCodec", () => {
    test("correct", () => {
        const values: any[] = [BigNumber.from(1), "0x"];
        expect(
            EtherWithdrawCodec.decode(EtherWithdrawCodec.encode(values))
        ).toEqual(values);
    });

    test("incorrect-", () => {
        const values: any[] = [BigNumber.from(1)];
        expect(() =>
            EtherWithdrawCodec.decode(EtherWithdrawCodec.encode(values))
        ).toThrow();
    });

    test("incorrect+", () => {
        const values: any[] = [BigNumber.from(1), "0x", 2];
        expect(() =>
            EtherWithdrawCodec.decode(EtherWithdrawCodec.encode(values))
        ).toThrow();
    });
});
