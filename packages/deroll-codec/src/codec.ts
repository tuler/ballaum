import { defaultAbiCoder, ParamType, Result } from "@ethersproject/abi";
import { toUtf8Bytes } from "@ethersproject/strings";
import { keccak256 } from "@ethersproject/keccak256";

type Type = string | ParamType;
const HEADER_TYPE = "bytes32";

export interface InputCodec<E, D> {
    encode(value: E): string;
    decode(payload: string): D;
}

export class ABIHeaderInputCodec implements InputCodec<Type[], Result> {
    public readonly framework: string;
    public readonly name: string;
    public readonly address: string | undefined;
    public readonly header: string;
    public readonly types: Type[];

    constructor(
        types: Type[],
        framework: string,
        name: string,
        address?: string
    ) {
        this.types = types;
        this.framework = framework;
        this.name = name;
        this.address = address;

        // header is keccak256 of keccak(framework) + keccak(name)
        this.header = keccak256(
            toUtf8Bytes(
                keccak256(toUtf8Bytes(framework)) + keccak256(toUtf8Bytes(name))
            )
        );
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

export class ABIInputCodec implements InputCodec<Type[], Result> {
    public readonly types: Type[];
    public readonly address: string;

    constructor(types: Type[], address: string) {
        this.types = types;
        this.address = address;
    }

    public encode(values: any[]): string {
        return defaultAbiCoder.encode(this.types, values);
    }

    public decode(payload: string): Result {
        return defaultAbiCoder.decode(this.types, payload);
    }
}
