import { FC } from "react";
import {
    TableContainer,
    Table,
    Tbody,
    Tr,
    Td,
    Text,
    HStack,
} from "@chakra-ui/react";

type LeaderboardTableProps = {
    scores: Record<string, number>;
};

type UserScore = {
    user: string;
    score: number;
};

export const LeaderboardTable: FC<LeaderboardTableProps> = ({ scores }) => {
    const leaderboard = Object.entries(scores).map<UserScore>(
        ([user, score]) => ({ user, score })
    );
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
            </Table>
        </TableContainer>
    );
};
