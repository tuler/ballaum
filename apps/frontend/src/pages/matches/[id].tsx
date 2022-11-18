import Head from "next/head";
import Image from "next/image";
import { VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";

import styles from "../../../styles/Home.module.css";
import { MatchCard } from "../../components/match";
import { useMatch } from "../../services/match";
import { MatchLeaderboardTable } from "../../components/matchLeaderboard";
import { PredictionCard } from "../../components/prediction";
import { ResultCard } from "../../components/result";

export default function Home() {
    const dapp = process.env.NEXT_PUBLIC_DAPP_ADDRESS!;
    const router = useRouter();
    const { id } = router.query;

    const match = useMatch("wc2022", id as string);
    const canPredict = match && match.start > Date.now();

    return (
        <div className={styles.container}>
            <Head>
                <title>World Cup 2022</title>
                <meta name="description" content="World Cup 2022" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <VStack spacing={10}>
                    <Image src="/logo.svg" width={400} alt="logo" height={10} />
                    {match && <MatchCard key={match.id} match={match} />}
                    {match && !match.result && (
                        <ResultCard dapp={dapp} match={match} />
                    )}
                    {canPredict && <PredictionCard dapp={dapp} match={match} />}
                    {match && (
                        <MatchLeaderboardTable items={match.predictions} />
                    )}
                </VStack>
            </main>

            <footer className={styles.footer}></footer>
        </div>
    );
}
