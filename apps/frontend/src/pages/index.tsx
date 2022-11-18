import Head from "next/head";
import { VStack } from "@chakra-ui/react";
import NextLink from "next/link";
import { Match } from "ballaum-common";

import styles from "../../styles/Home.module.css";
import { MatchCard } from "../components/match";
import { LeaderboardTable } from "../components/leaderboard";
import { AddMatchCard } from "../components/addMatch";
import { Header } from "../components/header";
import { useTournament } from "../services/tournament";

export default function Home() {
    const dapp = process.env.NEXT_PUBLIC_DAPP_ADDRESS!;
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

    const tournament = useTournament("wc2022");
    const list = Object.values(tournament?.matches ?? {}).sort(sort);
    const scores = tournament?.scores ?? {};

    return (
        <div className={styles.container}>
            <Head>
                <title>World Cup 2022</title>
                <meta name="description" content="World Cup 2022" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <VStack spacing={10}>
                    <Header dapp={dapp} />
                    {Object.keys(scores).length > 0 && (
                        <LeaderboardTable scores={scores} />
                    )}
                    <ul>
                        {list.map((match) => (
                            <NextLink
                                key={match.id}
                                href={`/matches/${match.id}`}
                                passHref
                            >
                                <MatchCard match={match} />
                            </NextLink>
                        ))}
                    </ul>
                    <AddMatchCard dapp={dapp} />
                </VStack>
            </main>

            <footer className={styles.footer}></footer>
        </div>
    );
}
