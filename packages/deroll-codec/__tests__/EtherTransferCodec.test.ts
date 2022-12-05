import { describe, expect, test } from "@jest/globals";
import { BigNumber } from "@ethersproject/bignumber";
import { AddressZero } from "@ethersproject/constants";

import { EtherTransferCodec } from "../src";

describe("EtherTransferCodec", () => {
    test("correct", () => {
        const values: any[] = [AddressZero, BigNumber.from(1), "0x"];
        expect(
            EtherTransferCodec.decode(EtherTransferCodec.encode(values))
        ).toEqual(values);
    });

    test("incorrect-", () => {
        const values: any[] = [AddressZero, BigNumber.from(1)];
        expect(() =>
            EtherTransferCodec.decode(EtherTransferCodec.encode(values))
        ).toThrow();
    });

    test("incorrect+", () => {
        const values: any[] = [AddressZero, BigNumber.from(1), "0x", 2];
        expect(() =>
            EtherTransferCodec.decode(EtherTransferCodec.encode(values))
        ).toThrow();
    });
});
