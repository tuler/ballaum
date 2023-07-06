import { describe, expect, test } from "@jest/globals";
import { BigNumber } from "@ethersproject/bignumber";
import { AddressZero } from "@ethersproject/constants";
import { parseEther } from "@ethersproject/units";

import { EtherDepositCodec } from "../src";

describe("EtherDepositCodec", () => {
    test("encode harcoded", () => {
        expect(
            EtherDepositCodec.encode([
                "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
                parseEther("1"),
                "0x",
            ])
        ).toEqual(
            "0xf39fd6e51aad88f6f4ce6ab8827279cfffb922660000000000000000000000000000000000000000000000000de0b6b3a7640000"
        );
    });

    test("decode harcoded", () => {
        expect(
            EtherDepositCodec.decode(
                "0xf39fd6e51aad88f6f4ce6ab8827279cfffb922660000000000000000000000000000000000000000000000000de0b6b3a7640000"
            )
        ).toEqual([
            "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
            BigNumber.from(
                "0x0000000000000000000000000000000000000000000000000de0b6b3a7640000"
            ),
            "0x",
        ]);
    });

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
