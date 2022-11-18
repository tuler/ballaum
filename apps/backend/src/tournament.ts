import { indexBy } from "underscore";
import { User, Match, MatchPrediction, MatchResult } from "ballaum-common";
import { getAddress } from "@ethersproject/address";
import { CompleteScoreSystem, ScoreSystem } from "./score";

export class Tournament {
    public readonly manager: string;
    private terminated: boolean;
    public readonly scores: Record<User, number>;
    public readonly matches: Record<string, Match>;
    private scoreSystem: ScoreSystem;

    constructor(manager: string, matches: Match[]) {
        this.manager = getAddress(manager);
        this.terminated = false;
        this.matches = indexBy(matches, "id");
        this.scores = {};
        this.scoreSystem = new CompleteScoreSystem();
    }

    setPrediction(id: string, prediction: MatchPrediction) {
        const match = this.matches[id];

        if (!match) {
            throw new Error(`unknown match ${id}`);
        }

        if (this.terminated) {
            throw new Error(`tournament terminated`);
        }

        // can only place prediction before match starts
        if (prediction.timestamp >= match.start) {
            throw new Error(`match ${match.id} already started`);
        }

        // validate number of goals
        if (prediction.team1Goals < 0) {
            throw new Error(
                `invalid number of goals: ${prediction.team1Goals}`
            );
        }
        if (prediction.team2Goals < 0) {
            throw new Error(
                `invalid number of goals: ${prediction.team2Goals}`
            );
        }

        match.predictions[prediction.from] = prediction;
        if (this.scores[prediction.from] === undefined) {
            this.scores[prediction.from] = 0;
        }
    }

    getMatch(id: string): Readonly<Match | undefined> {
        return this.matches[id];
    }

    setResult(id: string, result: MatchResult) {
        const match = this.matches[id];

        if (!match) {
            throw new Error(`unknown match ${id}`);
        }

        // validate number of goals
        if (result.team1Goals < 0) {
            throw new Error(`invalid number of goals: ${result.team1Goals}`);
        }
        if (result.team2Goals < 0) {
            throw new Error(`invalid number of goals: ${result.team2Goals}`);
        }

        // save result
        match.result = result;

        // calculate scores for each prediction
        Object.values(match.predictions).forEach((prediction) => {
            prediction.score = this.scoreSystem.score(result, prediction);
        });

        // integrate scores into global score
        Object.entries(match.predictions).forEach(([user, prediction]) => {
            const { score } = prediction;
            if (score !== undefined) {
                this.scores[user] = this.scores[user]
                    ? this.scores[user] + score
                    : score;
            }
        });
    }

    addMatch(id: string, match: Omit<Match, "predictions" | "result">): Match {
        const existingMatch = this.matches[id];
        if (existingMatch) {
            if (existingMatch.result) {
                throw new Error(`can't change match ${id} with result`);
            }
            if (Object.keys(existingMatch.predictions).length > 0) {
                throw new Error(`can't change match ${id} with predictions`);
            }
        }

        return (this.matches[id] = {
            ...match,
            predictions: {},
        });
    }

    terminate(): User[] {
        const { scores } = this;

        // flip to terminated
        this.terminated = true;

        const leaderboard = Object.entries(scores).sort(
            ([_u1, score1], [_u2, score2]) => {
                return score2 - score1;
            }
        );

        // returns winners, plurar, because users may be tied in first place
        if (leaderboard.length > 0) {
            const highScore = leaderboard[0][1];
            const s = leaderboard.findIndex((b) => b[1] < highScore);
            const top = leaderboard.slice(0, s >= 0 ? s : undefined);
            return top.map((b) => b[0]);
        }
        return [];
    }
}
