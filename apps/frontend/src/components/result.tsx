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
import { useWaitForTransaction } from "wagmi";
import { Address, encodeFunctionData } from "viem";
import { ABI, Match } from "ballaum-common";

import {
    useInputBoxAddInput,
    usePrepareInputBoxAddInput,
} from "../hooks/rollups";

type ResultCardProps = {
    dapp: Address;
    match: Match;
};

export const ResultCard: FC<ResultCardProps> = ({ dapp, match }) => {
    const [team1Goals, setTeam1Goals] = useState<string>();
    const [team2Goals, setTeam2Goals] = useState<string>();

    const { config, error } = usePrepareInputBoxAddInput({
        args: [
            dapp,
            encodeFunctionData({
                abi: ABI,
                functionName: "setResult",
                args: [
                    "libertadores2023",
                    match.id,
                    parseInt(team1Goals ?? "0"),
                    parseInt(team2Goals ?? "0"),
                ],
            }),
        ],
    });
    const { data: tx, write } = useInputBoxAddInput(config);
    const { data: receipt, isError, isLoading } = useWaitForTransaction(tx);

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
                        {write && (
                            <Button
                                colorScheme="purple"
                                isLoading={isLoading}
                                loadingText="Saving..."
                                width={120}
                                disabled={!team1Goals || !team2Goals}
                                onClick={() => write()}
                            >
                                Set Result
                            </Button>
                        )}
                    </ButtonGroup>
                </VStack>
            </CardFooter>
        </Card>
    );
};
