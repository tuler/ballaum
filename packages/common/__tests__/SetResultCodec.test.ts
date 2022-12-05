import { describe, expect, test } from "@jest/globals";

import { SetResultCodec } from "../src";

describe("SetResultCodec", () => {
    test("correct", () => {
        const values: any[] = ["A", "B", 1, 2];
        expect(SetResultCodec.decode(SetResultCodec.encode(values))).toEqual(
            values
        );
    });

    test("incorrect-", () => {
        const values: any[] = ["A", "B", 1];
        expect(() =>
            SetResultCodec.decode(SetResultCodec.encode(values))
        ).toThrow();
    });

    test("incorrect+", () => {
        const values: any[] = ["A", "B", "C", 1, 2];
        expect(() =>
            SetResultCodec.decode(SetResultCodec.encode(values))
        ).toThrow();
    });
});
