import { ABIHeaderInputCodec } from "@deroll/codec";

export * from "./types";

// application codecs
export const AddMatchCodec = new ABIHeaderInputCodec(
    [
        "string", // tournamentId
        "string", // matchId
        "string", // team1
        "string", // team2
        "uint", // timestamp of the match
    ],
    "ballaum",
    "AddMatch"
);

export const SetPredictionCodec = new ABIHeaderInputCodec(
    [
        "string", // tournamentId
        "string", // matchId
        "uint8", // team1Score
        "uint8", // team2Score
    ],
    "ballaum",
    "SetPrediction"
);
export const SetResultCodec = new ABIHeaderInputCodec(
    [
        "string", // tournamentId
        "string", // matchId
        "uint8", // team1Score
        "uint8", // team2Score
    ],
    "ballaum",
    "SetResult"
);
export const TerminateCodec = new ABIHeaderInputCodec(
    ["string"], // tournamentId
    "ballaum",
    "Terminate"
);
