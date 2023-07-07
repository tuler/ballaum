import { defaultAbiCoder, ParamType, Result } from "@ethersproject/abi";
import { toUtf8Bytes } from "@ethersproject/strings";
import { keccak256 } from "@ethersproject/keccak256";
import { getAddress } from "@ethersproject/address";
import { pack } from "@ethersproject/solidity";
import { unpack } from "./unpack";

const HEADER_TYPE = "bytes32";

export interface InputCodec<E, D> {
    encode(value: E): string;
    decode(payload: string): D;
}

export class ABIInputCodec implements InputCodec<string[], Result> {
    public readonly types: string[];
    public readonly header?: string;
    _encode;
    _decode;

    constructor(types: string[], packed: boolean, header?: [string, string]) {
        // defines encode/decode methods depending on `packed`
        if (packed) {
            this._encode = pack;
            this._decode = unpack;
        } else {
            this._encode = defaultAbiCoder.encode.bind(defaultAbiCoder);
            this._decode = defaultAbiCoder.decode.bind(defaultAbiCoder);
        }

        // defines types and header depending on `header`
        if (header === undefined) {
            this.types = types;
        } else {
            // we should have a header (framework + method)
            this.types = [HEADER_TYPE, ...types];
            // actual header will be keccak256 of keccak256(framework) + keccak256(method)
            this.header = keccak256(
                toUtf8Bytes(
                    keccak256(toUtf8Bytes(header[0])) +
                        keccak256(toUtf8Bytes(header[1]))
                )
            );
        }
    }

    public encode(values: any[]): string {
        if (this.header !== undefined) {
            return this._encode(this.types, [this.header, ...values]);
        } else {
            return this._encode(this.types, values);
        }
    }

    public decode(payload: string): Result {
        if (this.header !== undefined) {
            const [_header, ...result] = this._decode(this.types, payload);
            return result;
        } else {
            return this._decode(this.types, payload);
        }
    }
}
