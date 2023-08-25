import { FC, useState } from "react";
import {
    Alert,
    AlertIcon,
    Button,
    ButtonGroup,
    Card,
    CardBody,
    CardFooter,
    HStack,
    Input,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useWaitForTransaction } from "wagmi";
import { ABI, Match } from "ballaum-common";
import { Address, encodeFunctionData, formatEther, parseEther } from "viem";

import {
    useInputBoxAddInput,
    usePrepareInputBoxAddInput,
} from "../hooks/rollups";

type PredictionCardProps = {
    enrolled: boolean;
    hasBalance: boolean;
    dapp: Address;
    match: Match;
};

export const PredictionCard: FC<PredictionCardProps> = ({
    dapp,
    match,
    enrolled,
    hasBalance,
}) => {
    const [team1Goals, setTeam1Goals] = useState<string>();
    const [team2Goals, setTeam2Goals] = useState<string>();

    const { config, error } = usePrepareInputBoxAddInput({
        args: [
            dapp,
            encodeFunctionData({
                abi: ABI,
                functionName: "setPrediction",
                args: [
                    "wc2022",
                    match.id,
                    parseInt(team1Goals || "0"),
                    parseInt(team2Goals || "0"),
                ],
            }),
        ],
    });
    const { data: tx, write } = useInputBoxAddInput(config);
    const { data: receipt, isError, isLoading } = useWaitForTransaction(tx);

    const fee = parseEther("0.01");
    const feeFormatted: string = formatEther(fee);

    // need signup if balance is lower than signup fee
    const overdue = match.start <= Date.now();
    const filled = team1Goals && team2Goals;

    return (
        <Card key={match.id} align="center">
            <CardBody>
                <VStack>
                    {overdue && !match.result && (
                        <Alert status="error">
                            <AlertIcon />
                            {`Match is ongoing, predictions closed`}
                        </Alert>
                    )}
                    {!enrolled && !hasBalance && (
                        <Alert status="warning">
                            <AlertIcon />
                            {`To participate you must first deposit at least ${feeFormatted} ETH`}
                        </Alert>
                    )}
                    {!enrolled && hasBalance && (
                        <Alert status="info">
                            <AlertIcon />
                            {`A fee of ${feeFormatted} ETH will be transferred from your DApp wallet`}
                        </Alert>
                    )}
                    <HStack spacing={5}>
                        <Input
                            width={55}
                            value={team1Goals}
                            onChange={(e) => setTeam1Goals(e.target.value)}
                        />
                        <Text>x</Text>
                        <Input
                            width={55}
                            value={team2Goals}
                            onChange={(e) => setTeam2Goals(e.target.value)}
                        />
                    </HStack>
                </VStack>
            </CardBody>
            <CardFooter>
                <VStack>
                    <ButtonGroup spacing="2">
                        {write && (
                            <Button
                                colorScheme="purple"
                                isLoading={isLoading}
                                loadingText="Saving..."
                                width={120}
                                disabled={
                                    !filled ||
                                    (!enrolled && !hasBalance) ||
                                    overdue
                                }
                                onClick={() => write()}
                            >
                                Set Prediction
                            </Button>
                        )}
                    </ButtonGroup>
                </VStack>
            </CardFooter>
        </Card>
    );
};
