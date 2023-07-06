import { defaultAbiCoder, ParamType, Result } from "@ethersproject/abi";
import { toUtf8Bytes } from "@ethersproject/strings";
import { keccak256 } from "@ethersproject/keccak256";
import { getAddress } from "@ethersproject/address";
import { pack } from "@ethersproject/solidity";
import { unpack } from "./unpack";

type Type = string | ParamType;
const HEADER_TYPE = "bytes32";

export interface InputCodec<E, D> {
    encode(value: E): string;
    decode(payload: string): D;
}

export class ABIHeaderInputCodec implements InputCodec<string[], Result> {
    public readonly types: string[];
    public readonly packed: boolean;
    public readonly framework: string;
    public readonly name: string;
    public readonly address: string | undefined;
    public readonly header: string;

    constructor(
        types: string[],
        packed: boolean,
        framework: string,
        name: string,
        address?: string
    ) {
        this.types = types;
        this.packed = packed;
        this.framework = framework;
        this.name = name;
        if (address !== undefined) {
            this.address = getAddress(address);
        }

        // header is keccak256 of keccak(framework) + keccak(name)
        this.header = keccak256(
            toUtf8Bytes(
                keccak256(toUtf8Bytes(framework)) + keccak256(toUtf8Bytes(name))
            )
        );
    }

    public encode(values: any[]): string {
        if (this.packed) {
            return pack([HEADER_TYPE, ...this.types], [this.header, ...values]);
        } else {
            return defaultAbiCoder.encode(
                [HEADER_TYPE, ...this.types],
                [this.header, ...values]
            );
        }
    }

    public decode(payload: string): Result {
        const types = [HEADER_TYPE, ...this.types];
        if (this.packed) {
            const [_header, ...result] = unpack(types, payload);
            return result;
        } else {
            const [_header, ...result] = defaultAbiCoder.decode(types, payload);
            return result;
        }
    }
}

export class ABIInputCodec implements InputCodec<string[], Result> {
    public readonly types: string[];
    public readonly packed: boolean;
    public readonly address: string;

    constructor(types: string[], packed: boolean, address: string) {
        this.types = types;
        this.packed = packed;
        this.address = getAddress(address);
    }

    public encode(values: any[]): string {
        if (this.packed) {
            return pack(this.types, values);
        } else {
            return defaultAbiCoder.encode(this.types, values);
        }
    }

    public decode(payload: string): Result {
        if (this.packed) {
            return unpack(this.types, payload);
        } else {
            return defaultAbiCoder.decode(this.types, payload);
        }
    }
}
