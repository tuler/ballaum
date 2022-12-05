import { describe, expect, test } from "@jest/globals";

import { TerminateCodec } from "../src";

describe("TerminateCodec", () => {
    test("correct", () => {
        const values: any[] = ["A"];
        expect(TerminateCodec.decode(TerminateCodec.encode(values))).toEqual(
            values
        );
    });

    test("incorrect-", () => {
        const values: any[] = [];
        expect(() =>
            TerminateCodec.decode(TerminateCodec.encode(values))
        ).toThrow();
    });

    test("incorrect+", () => {
        const values: any[] = ["A", "B"];
        expect(() =>
            TerminateCodec.decode(TerminateCodec.encode(values))
        ).toThrow();
    });
});
