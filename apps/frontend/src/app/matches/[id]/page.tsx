"use client";

import { FC } from "react";
import { Tournament, Wallet } from "ballaum-common";
import { VStack } from "@chakra-ui/react";
import { useAccount, useNetwork } from "wagmi";
import { getAddress } from "@ethersproject/address";
import { BigNumber } from "@ethersproject/bignumber";
import { parseEther } from "@ethersproject/units";

import { useInspect } from "../../../services/inspect";
import { MatchCard } from "../../../components/match";
import { ResultCard } from "../../../components/result";
import { PredictionCard } from "../../../components/prediction";
import { MatchLeaderboardTable } from "../../../components/matchLeaderboard";
import { useDAppAddress } from "../../../services/contract";
import { MatchCardLoading } from "../../../components/MatchCardLoading";

type PageParams = {
    id: string;
};

type PageProps = {
    params: PageParams;
};

const MatchPage: FC<PageProps> = ({ params: { id } }) => {
    // get dapp address
    const dapp = useDAppAddress();

    // get connected address
    const { address } = useAccount();

    // get DApp wallet
    const wallet = useInspect<Wallet>(
        address ? `/wallet/${address}` : undefined
    );

    // get connected network
    const network = useNetwork();

    // get match information (and tournament)
    const {
        report: tournament,
        error,
        data,
    } = useInspect<Tournament>(`/tournaments/wc2022/matches/${id}`);
    const loading = !error && !data;

    // flag if user is already enrolled in tournament
    const enrolled =
        !!address && !!tournament && tournament.scores[address] !== undefined;

    // check if user has enough balance to enroll
    const fee = parseEther("0.01"); // XXX: fixed? should come in tournament data
    const hasBalance =
        !!wallet.report && BigNumber.from(wallet.report.ether).gte(fee);

    const match = tournament?.matches[id];
    const canSetResult =
        dapp &&
        match &&
        !match.result &&
        tournament.manager == getAddress(address as string);
    const canPredict = dapp && match && match.start > Date.now();

    return (
        <VStack spacing={10}>
            {loading && <MatchCardLoading />}
            {match && <MatchCard key={match.id} match={match} />}
            {canSetResult && <ResultCard dapp={dapp} match={match} />}
            {canPredict && (
                <PredictionCard
                    dapp={dapp}
                    match={match}
                    enrolled={enrolled}
                    hasBalance={hasBalance}
                    chainId={network.chain?.id}
                />
            )}
            {match && <MatchLeaderboardTable items={match.predictions} />}
        </VStack>
    );
};

export default MatchPage;
