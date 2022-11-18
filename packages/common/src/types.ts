export type Team = string;
export type User = string;

export interface Match {
    id: string;
    team1: Team;
    team2: Team;
    start: number;
    predictions: Record<User, MatchPrediction>;
    result?: MatchResult;
}

export interface MatchResult {
    team1Goals: number; // goals in regular time
    team2Goals: number; // goals in regular time
    // we only account for regular time goals, for prediction purposes
}

// prediction is only goals in regular time
export interface MatchPrediction {
    from: User;
    timestamp: number;
    team1Goals: number;
    team2Goals: number;
    score?: number; // this prediction score based on score system
}

export interface Tournament {
    id: string;
    manager: string;
    matches: Record<string, Match>;
    scores: Record<string, number>;
}

export interface Wallet {
    ether: string;
    token: Record<string, string>;
}
