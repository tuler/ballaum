import { FC } from "react";
import {
    TableContainer,
    Table,
    Tbody,
    Tr,
    Td,
    Text,
    HStack,
    Tfoot,
    ButtonGroup,
    Button,
} from "@chakra-ui/react";
import { TerminateCodec, Tournament } from "ballaum-common";
import {
    useAccount,
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
} from "wagmi";
import { InputFacet__factory } from "@cartesi/rollups";

type LeaderboardTableProps = {
    dapp: string;
    tournament?: Tournament;
};

type UserScore = {
    user: string;
    score: number;
};

export const LeaderboardTable: FC<LeaderboardTableProps> = ({
    dapp,
    tournament,
}) => {
    const scores = tournament?.scores ?? {};
    const manager = tournament?.manager;
    const { address } = useAccount();
    const leaderboard = Object.entries(scores)
        .map<UserScore>(([user, score]) => ({ user, score }))
        .sort((a, b) => b.score - a.score);

    const { config, error } = usePrepareContractWrite({
        address: dapp,
        abi: InputFacet__factory.abi,
        functionName: "addInput",
        enabled: !!tournament,
        args: [TerminateCodec.encode([tournament?.id ?? ""])],
    });

    const { data: tx, write } = useContractWrite(config);
    const { data: receipt, isError, isLoading } = useWaitForTransaction(tx);

    return (
        <TableContainer width="full">
            <Table>
                <Tbody>
                    {leaderboard.map((item) => (
                        <Tr key={item.user}>
                            <Td>
                                <Text>{item.user}</Text>
                            </Td>
                            <Td textAlign="right">
                                <HStack align="baseline" spacing={1}>
                                    <Text fontSize="2xl">{item.score}</Text>
                                    <Text>pt</Text>
                                </HStack>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
                <Tfoot>
                    <Tr>
                        {manager && address === manager && (
                            <Td colSpan={2} textAlign="center">
                                <ButtonGroup>
                                    <Button
                                        colorScheme="purple"
                                        isLoading={isLoading}
                                        loadingText="Saving..."
                                        disabled={!write}
                                        onClick={() => write?.()}
                                    >
                                        Terminate
                                    </Button>
                                </ButtonGroup>
                            </Td>
                        )}
                    </Tr>
                </Tfoot>
            </Table>
        </TableContainer>
    );
};
