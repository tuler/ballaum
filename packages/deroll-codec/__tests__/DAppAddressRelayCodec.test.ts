import { describe, expect, test } from "@jest/globals";
import { AddressZero } from "@ethersproject/constants";

import { DAppAddressRelayCodec } from "../src";

describe("DAppAddressRelayCodec", () => {
    test("encode harcoded", () => {
        expect(
            DAppAddressRelayCodec.encode([
                "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
            ])
        ).toEqual("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266");
    });

    test("decode harcoded", () => {
        expect(
            DAppAddressRelayCodec.decode(
                "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
            )
        ).toEqual(["0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"]);
    });

    test("correct", () => {
        const values: any[] = [AddressZero];
        expect(
            DAppAddressRelayCodec.decode(DAppAddressRelayCodec.encode(values))
        ).toEqual(values);
    });

    test("incorrect-", () => {
        const values: any[] = [];
        expect(() =>
            DAppAddressRelayCodec.decode(DAppAddressRelayCodec.encode(values))
        ).toThrow();
    });

    test("incorrect+", () => {
        const values: any[] = [AddressZero, 2];
        expect(() =>
            DAppAddressRelayCodec.decode(DAppAddressRelayCodec.encode(values))
        ).toThrow();
    });
});
