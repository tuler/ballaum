"use client";

import { FC } from "react";
import { Match, Tournament } from "ballaum-common";
import NextLink from "next/link";
import { useNetwork } from "wagmi";
import { VStack } from "@chakra-ui/react";

import { LeaderboardTable } from "../components/leaderboard";
import { AddMatchCard } from "../components/addMatch";
import { MatchCard } from "../components/match";
import { useInspect } from "../hooks/inspect";
import { MatchCardLoading } from "../components/MatchCardLoading";
import { useDAppAddress } from "../hooks/contract";

const HomePage: FC = () => {
    // get dapp address
    const dapp = useDAppAddress();

    // get connected network
    const network = useNetwork();

    const sort = (match1: Match, match2: Match) => {
        if (match1.result && !match2.result) {
            // match with result goes in the end
            return 1;
        } else if (!match1.result && match2.result) {
            // match with result goes in the end
            return -1;
        } else if (match1.result && match2.result) {
            // matchs with results goes in reverse chronological order
            return match2.start - match1.start;
        } else if (!match1.result && !match2.result) {
            // matches without result goes in chronological order
            return match1.start - match2.start;
        }
        return 0;
    };

    const {
        report: tournament,
        error,
        data,
    } = useInspect<Tournament>(`/tournaments/wc2022`);
    const loading = !error && !data;
    const list = Object.values(tournament?.matches ?? {}).sort(sort);

    return (
        <>
            <VStack spacing={4}>
                {dapp && (
                    <LeaderboardTable dapp={dapp} tournament={tournament} />
                )}
                {loading && (
                    <>
                        <MatchCardLoading />
                        <MatchCardLoading />
                    </>
                )}
                {list.map((match) => (
                    <NextLink
                        key={match.id}
                        href={`/matches/${match.id}`}
                        passHref
                    >
                        <MatchCard match={match} />
                    </NextLink>
                ))}
                {dapp && network.chain && <AddMatchCard dapp={dapp} />}
            </VStack>
        </>
    );
};

export default HomePage;
