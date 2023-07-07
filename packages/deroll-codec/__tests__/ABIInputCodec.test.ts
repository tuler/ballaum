import { describe, expect, test } from "@jest/globals";
import { AddressZero } from "@ethersproject/constants";

import { ABIInputCodec } from "../src";

const HEADER: [string, string] = ["framework", "method"];

describe("ABIInputCodec", () => {
    test("packed no header", () => {
        const codec = new ABIInputCodec(["address"], true);
        const values: any[] = [AddressZero];
        expect(codec.decode(codec.encode(values))).toEqual(values);
    });

    test("packed header", () => {
        const codec = new ABIInputCodec(["address"], true, HEADER);
        const values: any[] = [AddressZero];
        expect(codec.decode(codec.encode(values))).toEqual(values);
    });

    test("unpacked no header", () => {
        const codec = new ABIInputCodec(["address"], false);
        const values: any[] = [AddressZero];
        expect(codec.decode(codec.encode(values))).toEqual(values);
    });

    test("unpacked header", () => {
        const codec = new ABIInputCodec(["address"], false, HEADER);
        const values: any[] = [AddressZero];
        expect(codec.decode(codec.encode(values))).toEqual(values);
    });
});
