import { mapObject } from "underscore";
import { zeroAddress } from "viem";

import { Tournament } from "../src/tournament";

describe("Tournament", () => {
    let tournament: Tournament;

    beforeEach(() => {
        tournament = new Tournament(
            "0x18930e8a66a1DbE21D00581216789AAB7460Afd0",
            [
                {
                    id: "A11",
                    team1: "BRA",
                    team2: "FRA",
                    start: new Date("2022-11-20T20:00:00+04:00").getTime(),
                    predictions: {},
                },
            ],
        );
    });

    test("init", () => {
        expect(tournament.scores).toStrictEqual({});
    });

    test("invalid match", () => {
        expect(() =>
            tournament.setPrediction("A1", {
                from: zeroAddress,
                team1Goals: 0,
                team2Goals: 0,
                timestamp: new Date("2022-11-20T20:00:00+04:00").getTime(),
            }),
        ).toThrow("unknown match A1");
    });

    test("prediction overdue", () => {
        expect(() =>
            tournament.setPrediction("A11", {
                from: zeroAddress,
                team1Goals: 0,
                team2Goals: 0,
                timestamp: new Date("2022-11-20T20:00:00+04:00").getTime(),
            }),
        ).toThrow("match A11 already started");
    });

    test("prediction tournament terminated", () => {
        tournament.terminate();
        expect(() =>
            tournament.setPrediction("A11", {
                from: zeroAddress,
                team1Goals: 0,
                team2Goals: 0,
                timestamp: new Date("2022-11-20T20:00:00+04:00").getTime(),
            }),
        ).toThrow("tournament terminated");
    });

    test("invalid prediction", () => {
        expect(() =>
            tournament.setPrediction("A11", {
                from: zeroAddress,
                team1Goals: -1,
                team2Goals: -4,
                timestamp: new Date("2022-11-20T19:59:00+04:00").getTime(),
            }),
        ).toThrow("invalid number of goals: -1");
    });

    test("invalid prediction", () => {
        expect(() =>
            tournament.setPrediction("A11", {
                from: zeroAddress,
                team1Goals: 0,
                team2Goals: -4,
                timestamp: new Date("2022-11-20T19:59:00+04:00").getTime(),
            }),
        ).toThrow("invalid number of goals: -4");
    });

    test("valid prediction", () => {
        const prediction = {
            from: zeroAddress,
            team1Goals: 1,
            team2Goals: 2,
            timestamp: new Date("2022-11-20T19:59:00+04:00").getTime(),
        };
        tournament.setPrediction("A11", prediction);
        expect(tournament.matches["A11"]?.predictions[prediction.from]).toEqual(
            prediction,
        );
    });

    test("setResult of unknown match", () => {
        expect(() =>
            tournament.setResult("A1", {
                team1Goals: 0,
                team2Goals: 0,
            }),
        ).toThrow("unknown match A1");
    });

    test("invalid result", () => {
        expect(() =>
            tournament.setResult("A11", {
                team1Goals: -1,
                team2Goals: 0,
            }),
        ).toThrow("invalid number of goals: -1");
    });

    test("invalid result", () => {
        expect(() =>
            tournament.setResult("A11", {
                team1Goals: 0,
                team2Goals: -2,
            }),
        ).toThrow("invalid number of goals: -2");
    });

    test("set result calculation", () => {
        tournament.setPrediction("A11", {
            from: "1",
            team1Goals: 1,
            team2Goals: 0,
            timestamp: 0,
        });
        tournament.setResult("A11", {
            team1Goals: 1,
            team2Goals: 0,
        });
        expect(tournament.matches["A11"].predictions["1"].score).toEqual(25);
        expect(tournament.scores["1"]).toEqual(25);

        tournament.addMatch("A12", {
            id: "A12",
            team1: "BRA",
            team2: "ARG",
            start: 1,
        });
        tournament.setPrediction("A12", {
            from: "1",
            team1Goals: 1,
            team2Goals: 0,
            timestamp: 0,
        });
        tournament.setResult("A12", {
            team1Goals: 2,
            team2Goals: 0,
        });
        expect(tournament.matches["A12"].predictions["1"].score).toEqual(12);
        expect(tournament.scores["1"]).toEqual(37);
    });

    test("add match", () => {
        const match = {
            id: "A11",
            team1: "BRA",
            team2: "FRA",
            start: new Date("2022-12-18T19:00:00+04:00").getTime(),
        };
        const addedmatch = tournament.addMatch("A11", match);
        expect(addedmatch).toEqual({ ...match, predictions: {} });

        tournament.setPrediction("A11", {
            from: "1",
            team1Goals: 2,
            team2Goals: 0,
            timestamp: 0,
        });
        expect(() => tournament.addMatch("A11", match)).toThrowError(
            "can't change match A11 with predictions",
        );

        // set match result
        tournament.setResult("A11", { team1Goals: 0, team2Goals: 0 });

        expect(() => tournament.addMatch("A11", match)).toThrowError(
            "can't change match A11 with result",
        );
    });

    test("score with winner", () => {
        tournament.setPrediction("A11", {
            from: "0x1",
            team1Goals: 3,
            team2Goals: 0,
            timestamp: 0,
        });

        tournament.setPrediction("A11", {
            from: "0x2",
            team1Goals: 3,
            team2Goals: 1,
            timestamp: 0,
        });

        tournament.setPrediction("A11", {
            from: "0x3",
            team1Goals: 4,
            team2Goals: 1,
            timestamp: 0,
        });

        tournament.setPrediction("A11", {
            from: "0x4",
            team1Goals: 2,
            team2Goals: 0,
            timestamp: 0,
        });

        tournament.setPrediction("A11", {
            from: "0x5",
            team1Goals: 7,
            team2Goals: 1,
            timestamp: 0,
        });

        tournament.setPrediction("A11", {
            from: "0x6",
            team1Goals: 0,
            team2Goals: 0,
            timestamp: 0,
        });

        tournament.setResult("A11", {
            team1Goals: 3,
            team2Goals: 0,
        });

        const expected = {
            "0x1": 25,
            "0x2": 18,
            "0x3": 15,
            "0x4": 12,
            "0x5": 10,
            "0x6": 0,
        };
        const predictions = tournament.matches["A11"]?.predictions!;
        const scores = mapObject(predictions, (p) => p.score!);
        expect(scores).toStrictEqual(expected);
        expect(tournament.scores).toStrictEqual(expected);
    });

    test("terminate with one winner", () => {
        tournament.setPrediction("A11", {
            from: "1",
            team1Goals: 1,
            team2Goals: 0,
            timestamp: 0,
        });
        tournament.setPrediction("A11", {
            from: "2",
            team1Goals: 2,
            team2Goals: 0,
            timestamp: 0,
        });
        tournament.setResult("A11", {
            team1Goals: 2,
            team2Goals: 0,
        });
        expect(tournament.terminate()).toEqual(["2"]);
    });

    test("terminate with two winners", () => {
        tournament.setPrediction("A11", {
            from: "1",
            team1Goals: 1,
            team2Goals: 0,
            timestamp: 0,
        });
        tournament.setPrediction("A11", {
            from: "2",
            team1Goals: 2,
            team2Goals: 0,
            timestamp: 0,
        });
        tournament.setPrediction("A11", {
            from: "3",
            team1Goals: 2,
            team2Goals: 0,
            timestamp: 0,
        });
        tournament.setResult("A11", {
            team1Goals: 2,
            team2Goals: 0,
        });
        expect(tournament.terminate()).toEqual(["2", "3"]);
    });
});
