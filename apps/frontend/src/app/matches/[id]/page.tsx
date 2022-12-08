"use client";

import { FC } from "react";
import { Tournament } from "ballaum-common";
import { Spinner, VStack } from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { getAddress } from "@ethersproject/address";

import { useInspect } from "../../../services/inspect";
import { MatchCard } from "../../../components/match";
import { ResultCard } from "../../../components/result";
import { PredictionCard } from "../../../components/prediction";
import { MatchLeaderboardTable } from "../../../components/matchLeaderboard";
import { useDAppAddress } from "../../../services/contract";

type PageParams = {
    id: string;
};

type PageProps = {
    params: PageParams;
};

const MatchPage: FC<PageProps> = ({ params: { id } }) => {
    const dapp = useDAppAddress();
    const { address } = useAccount();
    const {
        report: tournament,
        error,
        data,
    } = useInspect<Tournament>(`/tournaments/wc2022/matches/${id}`);
    const loading = !error && !data;

    const match = tournament?.matches[id];
    const canSetResult =
        dapp &&
        match &&
        !match.result &&
        tournament.manager == getAddress(address as string);
    const canPredict = dapp && match && match.start > Date.now();

    return (
        <VStack spacing={10}>
            {loading && <Spinner size="xl" />}
            {match && <MatchCard key={match.id} match={match} />}
            {canSetResult && <ResultCard dapp={dapp} match={match} />}
            {canPredict && <PredictionCard dapp={dapp} match={match} />}
            {match && <MatchLeaderboardTable items={match.predictions} />}
        </VStack>
    );
};

export default MatchPage;
