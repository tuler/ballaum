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
import { ABI } from "ballaum-common";
import { DatePickerInput } from "chakra-datetime-picker";
import { FC, useState } from "react";
import { Address, encodeFunctionData } from "viem";
import { useWaitForTransaction } from "wagmi";

import {
    useInputBoxAddInput,
    usePrepareInputBoxAddInput,
} from "../hooks/rollups";

interface AddMatchCardProps {
    dapp: Address;
}

export const AddMatchCard: FC<AddMatchCardProps> = ({ dapp }) => {
    const [id, setId] = useState<string>("");
    const [team1, setTeam1] = useState<string>("");
    const [team2, setTeam2] = useState<string>("");
    const [start, setStart] = useState<bigint>(0n);

    const { config, error } = usePrepareInputBoxAddInput({
        args: [
            dapp,
            encodeFunctionData({
                abi: ABI,
                functionName: "addMatch",
                args: ["wc2022", id, team1, team2, start],
            }),
        ],
    });
    const { data: tx, write } = useInputBoxAddInput(config);
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
                    onChange={(_, day) =>
                        day && setStart(BigInt(day.unix()) * 1000n)
                    }
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
