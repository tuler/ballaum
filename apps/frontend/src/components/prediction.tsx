import { FC, useState } from "react";
import {
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
    useAccount,
    useContractWrite,
    useNetwork,
    usePrepareContractWrite,
    useWaitForTransaction,
} from "wagmi";
import { Match, SetPredictionCodec } from "ballaum-common";
import { BigNumber } from "ethers";

type PredictionCardProps = {
    dapp: string;
    match: Match;
};

export const PredictionCard: FC<PredictionCardProps> = ({ dapp, match }) => {
    const network = useNetwork();
    const [team1Goals, setTeam1Goals] = useState<string>();
    const [team2Goals, setTeam2Goals] = useState<string>();
    const { isConnected } = useAccount();

    const { config, error } = usePrepareContractWrite({
        address: dapp,
        abi: InputFacet__factory.abi,
        functionName: "addInput",
        chainId: network.chain?.id,
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

    // need signup if balance is lower than signup fee
    const canPredict = match && match.start > Date.now();
    const filled = team1Goals && team2Goals && canPredict;

    return (
        <Card key={match.id} align="center">
            <CardBody>
                <VStack>
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
                        {isConnected && (
                            <Button
                                colorScheme="purple"
                                isLoading={isLoading}
                                loadingText="Saving..."
                                width={120}
                                disabled={!filled}
                                onClick={() => write?.()}
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
