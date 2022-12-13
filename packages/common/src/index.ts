import { ABIInputCodec } from "@deroll/codec";

export * from "./types";

// application codecs
export const AddMatchCodec = new ABIInputCodec("AddMatch", [
    "string", // tournamentId
    "string", // matchId
    "string", // team1
    "string", // team2
    "uint", // timestamp of the match
]);

export const SetPredictionCodec = new ABIInputCodec("SetPrediction", [
    "string", // tournamentId
    "string", // matchId
    "uint8", // team1Score
    "uint8", // team2Score
]);
export const SetResultCodec = new ABIInputCodec("SetResult", [
    "string", // tournamentId
    "string", // matchId
    "uint8", // team1Score
    "uint8", // team2Score
]);
export const TerminateCodec = new ABIInputCodec("Terminate", ["string"]); // tournamentId
