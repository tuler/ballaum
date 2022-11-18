import { MatchPrediction, MatchResult } from "ballaum-common";

enum Score {
    EXACT = 25, // exact score, including tie
    WINNER_GOALS = 18, // correct winner, correct number of goals of winner
    WINNER_DIFF = 15, // correct winner, correct different of goals
    LOSER_GOALS = 12, // correct winner, correct number of goals of loser
    WINNER = 10, // correct winner, but none of the conditions above
    TIE = 15, // correct tie, but not correct score
    WRONG = 0, // none of the conditions above
}

export interface ScoreSystem {
    score(result: MatchResult, prediction: MatchPrediction): number;
}

export class CompleteScoreSystem implements ScoreSystem {
    score(result: MatchResult, prediction: MatchPrediction): number {
        if (
            prediction.team1Goals == result.team1Goals &&
            prediction.team2Goals == result.team2Goals
        ) {
            return Score.EXACT;
        }

        if (
            result.team1Goals > result.team2Goals &&
            prediction.team1Goals > prediction.team2Goals
        ) {
            // team1 won
            if (prediction.team1Goals == result.team1Goals) {
                return Score.WINNER_GOALS;
            }
            if (
                result.team1Goals - result.team2Goals ==
                prediction.team1Goals - prediction.team2Goals
            ) {
                return Score.WINNER_DIFF;
            }
            if (prediction.team2Goals == result.team2Goals) {
                return Score.LOSER_GOALS;
            }
            return Score.WINNER;
        }

        if (
            result.team2Goals > result.team1Goals &&
            prediction.team2Goals > prediction.team1Goals
        ) {
            // team2 won
            if (prediction.team2Goals == result.team2Goals) {
                return Score.WINNER_GOALS;
            }
            if (
                result.team2Goals - result.team1Goals ==
                prediction.team2Goals - prediction.team1Goals
            ) {
                return Score.WINNER_DIFF;
            }
            if (prediction.team1Goals == result.team1Goals) {
                return Score.LOSER_GOALS;
            }
            return Score.WINNER;
        }

        if (result.team1Goals == result.team2Goals) {
            if (prediction.team1Goals == prediction.team2Goals) {
                return Score.TIE;
            }
        }

        // no points
        return Score.WRONG;
    }
}
