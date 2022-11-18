import { CompleteScoreSystem, ScoreSystem } from "../src/score";

describe("CompleteScoreSystem", () => {
    let scoreSystem: ScoreSystem;
    let win1 = {
        team1Goals: 4,
        team2Goals: 1,
    };
    let win2 = {
        team1Goals: 1,
        team2Goals: 4,
    };
    let tie = {
        team1Goals: 2,
        team2Goals: 2,
    };
    let p = {
        from: "1",
        timestamp: 0,
    };

    beforeEach(() => {
        scoreSystem = new CompleteScoreSystem();
    });

    test("exact", () => {
        expect(
            scoreSystem.score(win1, { ...p, team1Goals: 4, team2Goals: 1 })
        ).toBe(25);
        expect(
            scoreSystem.score(win2, { ...p, team1Goals: 1, team2Goals: 4 })
        ).toBe(25);
    });

    test("winner goals", () => {
        expect(
            scoreSystem.score(win1, { ...p, team1Goals: 4, team2Goals: 0 })
        ).toBe(18);
        expect(
            scoreSystem.score(win2, { ...p, team1Goals: 0, team2Goals: 4 })
        ).toBe(18);
    });

    test("diff", () => {
        expect(
            scoreSystem.score(win1, { ...p, team1Goals: 3, team2Goals: 0 })
        ).toBe(15);
        expect(
            scoreSystem.score(win2, { ...p, team1Goals: 0, team2Goals: 3 })
        ).toBe(15);
    });

    test("loser goals", () => {
        expect(
            scoreSystem.score(win1, { ...p, team1Goals: 3, team2Goals: 1 })
        ).toBe(12);
        expect(
            scoreSystem.score(win2, { ...p, team1Goals: 1, team2Goals: 3 })
        ).toBe(12);
    });

    test("winner", () => {
        expect(
            scoreSystem.score(win1, { ...p, team1Goals: 1, team2Goals: 0 })
        ).toBe(10);
        expect(
            scoreSystem.score(win2, { ...p, team1Goals: 0, team2Goals: 1 })
        ).toBe(10);
    });

    test("wrong", () => {
        expect(
            scoreSystem.score(win1, { ...p, team1Goals: 0, team2Goals: 1 })
        ).toBe(0);
        expect(
            scoreSystem.score(win2, { ...p, team1Goals: 1, team2Goals: 0 })
        ).toBe(0);
    });

    test("exact tie", () => {
        expect(
            scoreSystem.score(tie, { ...p, team1Goals: 2, team2Goals: 2 })
        ).toBe(25);
    });

    test("tie", () => {
        expect(
            scoreSystem.score(tie, { ...p, team1Goals: 1, team2Goals: 1 })
        ).toBe(15);
    });
});
