import { ABIInputCodec } from "@deroll/codec";

export * from "./types";

// application codecs
export const AddMatchCodec = new ABIInputCodec("AddMatch", [
    "string",
    "string",
    "string",
    "string",
    "uint",
]);
export const SetPredictionCodec = new ABIInputCodec("SetPrediction", [
    "string",
    "string",
    "uint8",
    "uint8",
]);
export const SetResultCodec = new ABIInputCodec("SetResult", [
    "string",
    "string",
    "uint8",
    "uint8",
]);
export const TerminateCodec = new ABIInputCodec("Terminate", ["string"]);
