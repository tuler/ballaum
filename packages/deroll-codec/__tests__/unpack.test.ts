import { describe, expect, test } from "@jest/globals";
import { BigNumber } from "@ethersproject/bignumber";
import { unpack } from "../src";

describe("unpack", () => {
    test("address", () => {
        expect(
            unpack(["address"], "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266")
        ).toEqual(["0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"]);
    });

    test("address + bytes32", () => {
        expect(
            unpack(
                ["address", "bytes32"],
                "0xf39fd6e51aad88f6f4ce6ab8827279cfffb922660000000000000000000000000000000000000000000000000000000000000064"
            )
        ).toEqual([
            "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
            "0x0000000000000000000000000000000000000000000000000000000000000064",
        ]);
    });

    test("address + uint256", () => {
        expect(
            unpack(
                ["address", "uint256"],
                "0xf39fd6e51aad88f6f4ce6ab8827279cfffb922660000000000000000000000000000000000000000000000000000000000000064"
            )
        ).toEqual([
            "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
            BigNumber.from("0x64"),
        ]);
    });

    test("address + uint", () => {
        expect(
            unpack(
                ["address", "uint"],
                "0xf39fd6e51aad88f6f4ce6ab8827279cfffb922660000000000000000000000000000000000000000000000000000000000000064"
            )
        ).toEqual([
            "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
            BigNumber.from("0x64"),
        ]);
    });

    test("address + bool(true)", () => {
        expect(
            unpack(
                ["address", "bool"],
                "0xf39fd6e51aad88f6f4ce6ab8827279cfffb9226601"
            )
        ).toEqual(["0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266", true]);
    });

    test("address + bool(false)", () => {
        expect(
            unpack(
                ["address", "bool"],
                "0xf39fd6e51aad88f6f4ce6ab8827279cfffb9226600"
            )
        ).toEqual(["0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266", false]);
    });

    test("address + bytes(short)", () => {
        expect(
            unpack(
                ["address", "bytes"],
                "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266deadbeef"
            )
        ).toEqual(["0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266", "0xdeadbeef"]);
    });

    test("address + bytes(long)", () => {
        expect(
            unpack(
                ["address", "bytes"],
                "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef"
            )
        ).toEqual([
            "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
            "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
        ]);
    });
});
