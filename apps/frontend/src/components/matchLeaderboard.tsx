import { FC } from "react";
import {
    TableContainer,
    Table,
    Tbody,
    Thead,
    Tr,
    Th,
    Td,
    Text,
} from "@chakra-ui/react";
import { MatchPrediction } from "ballaum-common";

type MatchLeaderboardItemProps = {
    item: MatchPrediction;
};

export const MatchLeaderboardItem: FC<MatchLeaderboardItemProps> = ({
    item,
}) => {
    return (
        <Tr key={item.from}>
            <Td>
                <Text>{item.from}</Text>
            </Td>
            <Td>
                <Text>
                    {item.team1Goals} x {item.team2Goals}
                </Text>
            </Td>
            <Td textAlign="end">
                <Text fontSize="2xl">{item.score}</Text>
            </Td>
        </Tr>
    );
};

type MatchLeaderboardTableProps = {
    items: Record<string, MatchPrediction>;
};

export const MatchLeaderboardTable: FC<MatchLeaderboardTableProps> = ({
    items,
}) => {
    const sort = (a: number | undefined, b: number | undefined) => {
        if (a && b) return b - a;
        if (a) return -1;
        if (b) return 1;
        return 0;
    };

    const predictions: MatchPrediction[] = Object.values(items ?? {}).sort(
        (a, b) => sort(a.score, b.score)
    );

    return (
        <TableContainer width="full">
            <Table>
                <Thead>
                    <Tr>
                        <Th>
                            <Text>User</Text>
                        </Th>
                        <Th>
                            <Text>Prediction</Text>
                        </Th>
                        <Th>
                            <Text>Score</Text>
                        </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {predictions.map((prediction) => (
                        <MatchLeaderboardItem
                            key={prediction.from}
                            item={prediction}
                        />
                    ))}
                    {predictions.length == 0 && (
                        <Tr>
                            <Td colSpan={3}>
                                <Text>no predictions</Text>
                            </Td>
                        </Tr>
                    )}
                </Tbody>
            </Table>
        </TableContainer>
    );
};
