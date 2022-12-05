import { describe, expect, test } from "@jest/globals";

import { SetPredictionCodec } from "../src";

describe("SetPredictionCodec", () => {
    test("correct", () => {
        const values: any[] = ["A", "B", 1, 2];
        expect(
            SetPredictionCodec.decode(SetPredictionCodec.encode(values))
        ).toEqual(values);
    });

    test("incorrect-", () => {
        const values: any[] = ["A", "B", 1];
        expect(() =>
            SetPredictionCodec.decode(SetPredictionCodec.encode(values))
        ).toThrow();
    });

    test("incorrect+", () => {
        const values: any[] = ["A", "B", "C", 1, 2];
        expect(() =>
            SetPredictionCodec.decode(SetPredictionCodec.encode(values))
        ).toThrow();
    });
});
