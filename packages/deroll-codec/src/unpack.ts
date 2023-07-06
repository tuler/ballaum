import { hexDataSlice } from "@ethersproject/bytes";
import { BigNumber } from "@ethersproject/bignumber";

/**
 * Decodes packed ABI encoded data
 * <p>
 * Only a subset of types are currently supported:
 * <ul>
 * <li>address</li>
 * <li>bytes32</li>
 * <li>uint256/uint</li>
 * <li>bool</li>
 * <li>bytes</li>
 * </ul>
 *
 * @param types array of types expected in the data
 * @param data hex string representing packed ABI encoded data
 * @returns array of values decoded from the data
 */
export function unpack(types: string[], data: string): any[] {
    const values: any[] = [];

    let offset = 0;
    types.forEach((type) => {
        let [value, size] = _unpack(type, offset, data);
        values.push(value);
        offset += size;
    });

    return values;
}

function _unpack(type: string, offset: number, data: string): [any, number] {
    // TODO: support other types as needed
    if (type === "address") {
        let slice = hexDataSlice(data, offset, offset + 20);
        return [slice, 20];
    } else if (type === "bytes32") {
        let slice = hexDataSlice(data, offset, offset + 32);
        return [slice, 32];
    } else if (type === "uint256" || type === "uint") {
        let slice = hexDataSlice(data, offset, offset + 32);
        return [BigNumber.from(slice), 32];
    } else if (type === "bool") {
        let slice = hexDataSlice(data, offset, offset + 1);
        return [slice !== "0x00", 1];
    } else if (type === "bytes") {
        let slice = hexDataSlice(data, offset);
        return [slice, slice.length];
    } else {
        throw new Error("Unsupported type: " + type);
    }
}
