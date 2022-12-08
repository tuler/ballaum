"use client";

import { FC } from "react";
import { Match, Tournament } from "ballaum-common";
import NextLink from "next/link";
import { LeaderboardTable } from "../components/leaderboard";
import { VStack } from "@chakra-ui/react";
import { AddMatchCard } from "../components/addMatch";
import { MatchCard } from "../components/match";
import { useInspect } from "../services/inspect";
import { MatchCardLoading } from "../components/MatchCardLoading";

const HomePage: FC = () => {
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
    const scores = tournament?.scores ?? {};

    return (
        <>
            {Object.keys(scores).length > 0 && (
                <LeaderboardTable scores={scores} />
            )}
            <VStack spacing={4}>
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
            </VStack>
        </>
    );
};

export default HomePage;
