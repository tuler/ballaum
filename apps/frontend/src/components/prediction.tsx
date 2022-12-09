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
import { InputFacet__factory } from "@cartesi/rollups";
import {
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
} from "wagmi";
import { Match, SetPredictionCodec } from "ballaum-common";
import { BigNumber } from "ethers";
import { formatEther, parseEther } from "@ethersproject/units";

type PredictionCardProps = {
    enrolled: boolean;
    hasBalance: boolean;
    dapp: string;
    match: Match;
    chainId?: number;
};

export const PredictionCard: FC<PredictionCardProps> = ({
    dapp,
    match,
    enrolled,
    hasBalance,
    chainId,
}) => {
    const [team1Goals, setTeam1Goals] = useState<string>();
    const [team2Goals, setTeam2Goals] = useState<string>();

    const { config, error } = usePrepareContractWrite({
        address: dapp,
        abi: InputFacet__factory.abi,
        functionName: "addInput",
        chainId,
        args: [
            SetPredictionCodec.encode([
                "wc2022",
                match.id,
                BigNumber.from(team1Goals || "0"),
                BigNumber.from(team2Goals || "0"),
            ]),
        ],
    });
    const { data: tx, write } = useContractWrite(config);
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
