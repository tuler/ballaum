import { FC } from "react";
import {
    Card,
    CardBody,
    Center,
    Heading,
    HStack,
    Text,
    VStack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
dayjs.extend(calendar);

import { Match } from "ballaum-common";
import { Team } from "./team";

type MatchCardProps = {
    match: Match;
};

export const MatchCard: FC<MatchCardProps> = ({ match }) => {
    const teamName = (code: string): string =>
        code.length > 3 ? code.substring(3) : code;

    return (
        <Card key={match.id} align="center">
            <CardBody>
                <VStack>
                    <Center>
                        <Text fontSize="sm">
                            {dayjs(new Date(match.start)).calendar(dayjs())}
                        </Text>
                    </Center>
                    <HStack spacing={5}>
                        <Text>{teamName(match.team1)}</Text>
                        <Team id={match.team1} />
                        {match.result ? (
                            <Heading>{match.result.team1Goals}</Heading>
                        ) : (
                            <Heading width={16}></Heading>
                        )}
                        <Text>x</Text>
                        {match.result ? (
                            <Heading>{match.result.team2Goals}</Heading>
                        ) : (
                            <Heading width={16}></Heading>
                        )}
                        <Team id={match.team2} />
                        <Text>{teamName(match.team2)}</Text>
                    </HStack>
                </VStack>
            </CardBody>
        </Card>
    );
};
