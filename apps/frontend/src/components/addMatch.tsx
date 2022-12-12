import { InputFacet__factory } from "@cartesi/rollups";
import {
    Button,
    ButtonGroup,
    Card,
    CardBody,
    CardFooter,
    HStack,
    Input,
    Text,
} from "@chakra-ui/react";
import { AddMatchCodec } from "ballaum-common";
import { DatePickerInput } from "chakra-datetime-picker";
import { FC, useState } from "react";
import {
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
} from "wagmi";

interface AddMatchCardProps {
    dapp: string;
    chainId?: number;
}

export const AddMatchCard: FC<AddMatchCardProps> = ({ chainId, dapp }) => {
    const [id, setId] = useState<string>("");
    const [team1, setTeam1] = useState<string>("");
    const [team2, setTeam2] = useState<string>("");
    const [start, setStart] = useState<number>(0);

    const { config, error } = usePrepareContractWrite({
        address: dapp,
        abi: InputFacet__factory.abi,
        functionName: "addInput",
        chainId,
        args: [AddMatchCodec.encode(["wc2022", id, team1, team2, start])],
    });
    const { data: tx, write } = useContractWrite(config);
    const { data: receipt, isError, isLoading } = useWaitForTransaction(tx);

    return (
        <Card>
            <CardBody>
                <Input
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                ></Input>
                <DatePickerInput
                    showTimeSelector
                    onChange={(_, day) => day && setStart(day.unix() * 1000)}
                />
                <HStack>
                    <Input
                        value={team1}
                        onChange={(e) => setTeam1(e.target.value)}
                    ></Input>
                    <Text>x</Text>
                    <Input
                        value={team2}
                        onChange={(e) => setTeam2(e.target.value)}
                    ></Input>
                </HStack>
            </CardBody>
            <CardFooter>
                <ButtonGroup>
                    {write && (
                        <Button
                            colorScheme="purple"
                            isLoading={isLoading}
                            loadingText="Saving..."
                            disabled={!id || !team1 || !team2 || !start}
                            onClick={() => write()}
                        >
                            Add
                        </Button>
                    )}
                </ButtonGroup>
            </CardFooter>
        </Card>
    );
};
