import { parseAbi } from "viem";
export * from "./types";

// application ABI
export const ABI = parseAbi([
    "function addMatch(string tournamentId, string matchId, string team1, string team2, uint timestamp)",
    "function setPrediction(string tournamentId, string matchId, uint8 team1Score, uint8 team2Score)",
    "function setResult(string tournamentId, string matchId, uint8 team1Score, uint8 team2Score)",
    "function terminate(string tournamentId)",
]);
