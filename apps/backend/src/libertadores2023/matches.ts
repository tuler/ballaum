import { Match } from "ballaum-common";

const matches: Match[] = [
    {
        id: "S11",
        team1: "BOC",
        team2: "PAL",
        start: new Date("2023-09-28T21:30:00-03:00").getTime(),
        predictions: {},
    },
    {
        id: "S12",
        team1: "PAL",
        team2: "BOC",
        start: new Date("2023-10-05T21:30:00-03:00").getTime(),
        predictions: {},
    },
    {
        id: "S21",
        team1: "FLU",
        team2: "INT",
        start: new Date("2023-09-27T21:30:00-03:00").getTime(),
        predictions: {},
    },
    {
        id: "S22",
        team1: "INT",
        team2: "FLU",
        start: new Date("2023-10-04T21:30:00-03:00").getTime(),
        predictions: {},
    },
];

export default matches;
