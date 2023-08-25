import { decodeFunctionData, formatEther, getAddress, parseEther } from "viem";
import { mapObject } from "underscore";
import { createApp, RequestMetadata } from "@deroll/app";
import { createWallet } from "@deroll/wallet";
import { createRouter } from "@deroll/router";
import { ABI, Match } from "ballaum-common";

import { Tournament } from "./tournament";

const rollupServer = process.env.ROLLUP_HTTP_SERVER_URL!;
const chainId: number = parseInt(process.env.CHAIN_ID ?? "31337");

console.log(`HTTP rollupServer at ${rollupServer}`);
console.log(`Running machine at chain ${chainId}`);

const fee = parseEther("0.01");
const tournaments: Record<string, Tournament> = {};

const wallet = createWallet();
const app = createApp({ url: rollupServer });
const router = createRouter({ app });

app.addAdvanceHandler(wallet.handler);
app.addInspectHandler(router.handler);

// inspect routing
router.add<{ tournamentId: string; matchId: string }>(
    "tournaments/:tournamentId/matches/:matchId",
    ({ params: { tournamentId, matchId } }) => {
        const tournament = tournaments[tournamentId];

        if (!tournament) {
            return JSON.stringify({});
        }

        const matches: Record<string, Match> = {};
        matches[matchId] = tournament.matches[matchId];

        return JSON.stringify({
            id: tournamentId,
            manager: tournament.manager,
            matches,
            scores: tournament.scores,
        });
    },
);

router.add<{ id: string }>("tournaments/:id", ({ params: { id } }) => {
    const tournament = tournaments[id];

    if (!tournament) {
        return JSON.stringify({});
    }

    // remove predictions from returned match (to reduce output)
    const dehydrator = (match: Match): Omit<Match, "predictions"> => {
        const { predictions, ...dry } = match;
        return dry;
    };
    const matches = mapObject(tournament.matches, dehydrator);

    return JSON.stringify({
        id,
        manager: tournament.manager,
        matches,
        scores: tournament.scores,
    });
});

router.add<{ address: string }>(
    "wallet/:address",
    ({ params: { address } }) => {
        const balance = wallet.balanceOf(address);
        return JSON.stringify({
            ether: balance.toString(),
        });
    },
);

// input routing
app.addAdvanceHandler(async ({ payload, metadata }) => {
    const { functionName, args } = decodeFunctionData({
        abi: ABI,
        data: payload,
    });

    switch (functionName) {
        case "addMatch":
            return addMatch(...args, metadata);
        case "setPrediction":
            return setPrediction(...args, metadata);
        case "setResult":
            return setResult(...args, metadata);
        case "terminate":
            return terminate(...args, metadata);
    }
});

// prediction handler
const setPrediction = (
    tournamentId: string,
    id: string,
    team1Goals: number,
    team2Goals: number,
    metadata: RequestMetadata,
) => {
    const tournament = tournaments[tournamentId];
    const user = getAddress(metadata.msg_sender);
    console.log(
        `prediction from ${user} for match ${id}: ${team1Goals} x ${team2Goals}`,
    );
    try {
        if (tournament.scores[user] === undefined) {
            // first time, transfer fee
            const tournamentWallet = `tournament:${tournamentId}`;
            console.log(
                `transferring ${formatEther(
                    fee,
                )} ETH to wallet ${tournamentWallet}`,
            );
            wallet.transferEther(user, tournamentWallet, fee);
        }

        tournament.setPrediction(id as string, {
            from: user,
            team1Goals,
            team2Goals,
            timestamp: metadata.timestamp,
        });
        return "accept";
    } catch (e) {
        console.error("SetPrediction", e);
        return "reject";
    }
};

// setResult handler
const setResult = (
    tournamentId: string,
    id: string,
    team1Goals: number,
    team2Goals: number,
    metadata: RequestMetadata,
) => {
    const tournament = tournaments[tournamentId];
    const user = getAddress(metadata.msg_sender);
    console.log(
        `setResult from ${user} for match ${id}: ${team1Goals} x ${team2Goals}`,
    );
    try {
        // check permission
        if (tournament.manager !== user) {
            return "reject";
        }

        tournament.setResult(id as string, {
            team1Goals,
            team2Goals,
        });
        return "accept";
    } catch (e) {
        console.error("SetResult", e);
        return "reject";
    }
};

const addMatch = (
    tournamentId: string,
    id: string,
    team1: string,
    team2: string,
    start_: bigint,
    metadata: RequestMetadata,
) => {
    const start = start_ as bigint;
    const user = getAddress(metadata.msg_sender);
    console.log(
        `addMatch ${id} to tournament ${tournamentId} from ${user} for match ${id}: ${team1} x ${team2} on ${new Date(
            Number(start),
        )} (${Number(start)})`,
    );
    try {
        const tournament = tournaments[tournamentId];

        // check permission
        if (tournament.manager !== user) {
            return "reject";
        }

        tournament.addMatch(id, {
            id,
            team1,
            team2,
            start: Number(start),
        });
        return "accept";
    } catch (e) {
        console.error("AddMatch", e);
        return "reject";
    }
};

const terminate = (tournamentId: string, metadata: RequestMetadata) => {
    try {
        console.log(`terminating tournament ${tournamentId}`);
        const tournament = tournaments[tournamentId];
        const user = getAddress(metadata.msg_sender);

        // check permission
        if (tournament.manager !== user) {
            return "reject";
        }

        const winners = tournament.terminate();
        if (winners.length > 0) {
            // get pot from tournament wallet
            const pot = wallet.balanceOf(`tournament:${tournamentId}`);
            console.log(
                `distributing pot of ${formatEther(
                    pot,
                )} ETH to winners ${winners}`,
            );

            // divide the prize with winners
            const prize = pot / BigInt(winners.length);

            // move prize to winners wallet
            winners.forEach((winner) => {
                wallet.transferEther(
                    `tournament:${tournamentId}`,
                    winner,
                    prize,
                );
            });
        }
    } catch (e) {
        console.error("Terminate", e);
        return "reject";
    }
    return "accept";
};

// add world cup 2022
import matches from "./wc2022/matches";
const manager: Record<number, string> = {
    31337: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", // localhost
    11155111: "0x2218B3b41581E3B3fea3d1CB5e37d9C66fa5d3A0", // sepolia
};
tournaments["wc2022"] = new Tournament(manager[chainId], matches);

app.start().catch((e) => process.exit(1));
