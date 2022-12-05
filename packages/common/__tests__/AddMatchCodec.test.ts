import { describe, expect, test } from "@jest/globals";
import { BigNumber } from "@ethersproject/bignumber";

import { AddMatchCodec } from "../src";

describe("AddMatchCodec", () => {
    test("correct", () => {
        const values: any[] = ["A", "B", "C", "D", BigNumber.from(1)];
        expect(AddMatchCodec.decode(AddMatchCodec.encode(values))).toEqual(
            values
        );
    });

    test("incorrect-", () => {
        const values: any[] = ["A", "B", "C", "D"];
        expect(() =>
            AddMatchCodec.decode(AddMatchCodec.encode(values))
        ).toThrow();
    });

    test("incorrect+", () => {
        const values: any[] = ["A", "B", "C", "D", BigNumber.from(1), "E"];
        expect(() =>
            AddMatchCodec.decode(AddMatchCodec.encode(values))
        ).toThrow();
    });
});
