import { defaultAbiCoder, ParamType, Result } from "@ethersproject/abi";
import { toUtf8Bytes } from "@ethersproject/strings";
import { keccak256 } from "@ethersproject/keccak256";

type Type = string | ParamType;
const HEADER_TYPE = "bytes32";

export interface InputCodec<E, D> {
    encode(value: E): string;
    decode(payload: string): D;
}

export class ABIInputCodec implements InputCodec<Type[], Result> {
    public readonly name: string;
    public readonly header: string;
    public readonly types: Type[];

    constructor(name: string, types: Type[]) {
        this.name = name;
        this.types = types;

        // header is keccak256 of name
        this.header = keccak256(toUtf8Bytes(name));
    }

    public encode(values: any[]): string {
        return defaultAbiCoder.encode(
            [HEADER_TYPE, ...this.types],
            [this.header, ...values]
        );
    }

    public decode(payload: string): Result {
        const [_header, ...result] = defaultAbiCoder.decode(
            [HEADER_TYPE, ...this.types],
            payload
        );
        return result;
    }
}
