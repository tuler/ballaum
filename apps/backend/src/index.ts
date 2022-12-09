import { BigNumber } from "@ethersproject/bignumber";
import { getAddress } from "@ethersproject/address";
import { formatEther, parseEther } from "@ethersproject/units";
import { mapObject } from "underscore";
import { DApp, Route } from "@deroll/app";
import {
    AddMatchCodec,
    Match,
    SetPredictionCodec,
    SetResultCodec,
    TerminateCodec,
} from "ballaum-common";

import { Tournament } from "./tournament";

const rollupServer = tjs.getenv("ROLLUP_HTTP_SERVER_URL");
const chainId: number = parseInt(tjs.getenv("CHAIN_ID"));

console.log(`HTTP rollupServer at ${rollupServer}`);
console.log(`Running machine at chain ${chainId}`);

const fee = parseEther("0.01");
const tournaments: Record<string, Tournament> = {};
const app = new DApp(rollupServer);

// inspect routing
app.inspectRouter.add<{ tournamentId: string; matchId: string }>(
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
    }
);

app.inspectRouter.add<{ id: string }>(
    "tournaments/:id",
    ({ params: { id } }) => {
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
    }
);

app.inspectRouter.add<{ address: string }>(
    "wallet/:address",
    ({ params: { address } }) => {
        const wallet = app.wallet.wallet(address);
        return JSON.stringify({
            ether: wallet.ether.toString(),
            erc20: mapObject(wallet.erc20, (v) => v.toString()),
        });
    }
);

// input routing

// prediction handler
app.inputRouter.add(
    new Route(
        SetPredictionCodec,
        ([tournamentId, id, team1Goals, team2Goals], metadata) => {
            const tournament = tournaments[tournamentId];
            const user = getAddress(metadata.msg_sender);
            console.log(
                `prediction from ${user} for match ${id}: ${team1Goals} x ${team2Goals}`
            );
            try {
                if (tournament.scores[user] === undefined) {
                    // first time, transfer fee
                    const tournamentWallet = `tournament:${tournamentId}`;
                    console.log(
                        `transferring ${formatEther(
                            fee
                        )} ETH to wallet ${tournamentWallet}`
                    );
                    app.wallet.transferEther(user, tournamentWallet, fee);
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
        }
    )
);

// setResult handler
app.inputRouter.add(
    new Route(
        SetResultCodec,
        ([tournamentId, id, team1Goals, team2Goals], metadata) => {
            const tournament = tournaments[tournamentId];
            const user = getAddress(metadata.msg_sender);
            console.log(
                `setResult from ${user} for match ${id}: ${team1Goals} x ${team2Goals}`
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
        }
    )
);

app.inputRouter.add(
    new Route(
        AddMatchCodec,
        ([tournamentId, id, team1, team2, start_], metadata) => {
            const start = start_ as BigNumber;
            const user = getAddress(metadata.msg_sender);
            console.log(
                `addMatch ${id} to tournament ${tournamentId} from ${user} for match ${id}: ${team1} x ${team2} on ${new Date(
                    start.toNumber()
                )} (${start.toNumber()})`
            );
            try {
                const tournament = tournaments[tournamentId];

                // check permission
                if (tournament.manager !== user) {
                    return "reject";
                }

                tournament.addMatch("AddMatch", {
                    id,
                    team1,
                    team2,
                    start: start.toNumber(),
                });
                return "accept";
            } catch (e) {
                console.error("AddMatch", e);
                return "reject";
            }
        }
    )
);

app.inputRouter.add(
    new Route(TerminateCodec, ([tournamentId], metadata) => {
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
                const pot = app.wallet.wallet(
                    `tournament:${tournamentId}`
                ).ether;
                console.log(
                    `distributing pot of ${formatEther(
                        pot
                    )} ETH to winners ${winners}`
                );

                // divide the prize with winners
                const prize = pot.div(winners.length);

                // move prize to winners wallet
                winners.forEach((winner) => {
                    app.wallet.transferEther(
                        `tournament:${tournamentId}`,
                        winner,
                        prize
                    );
                });
            }
        } catch (e) {
            console.error("Terminate", e);
            return "reject";
        }
        return "accept";
    })
);

// add world cup 2022
import matches from "./wc2022/matches";
const manager: Record<number, string> = {
    31337: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", // hardhat
    5: "0x2218B3b41581E3B3fea3d1CB5e37d9C66fa5d3A0", // goerli
};
tournaments["wc2022"] = new Tournament(manager[chainId], matches);

app.start().catch((e) => process.exit(1));
