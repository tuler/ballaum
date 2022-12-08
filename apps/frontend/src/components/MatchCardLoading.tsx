import { FC } from "react";
import {
    Card,
    CardBody,
    Center,
    HStack,
    Skeleton,
    Text,
    VStack,
} from "@chakra-ui/react";

type MatchCardLoadingProps = {};

export const MatchCardLoading: FC<MatchCardLoadingProps> = () => {
    return (
        <Card align="center">
            <CardBody>
                <VStack>
                    <Center>
                        <Skeleton w="140px" h="20px" />
                    </Center>
                    <HStack spacing={5}>
                        <Skeleton w="50px" h="20px" />
                        <Skeleton w="100px" h="70px" />
                        <Skeleton w="40px" h="50px" />
                        <Text>x</Text>
                        <Skeleton w="40px" h="50px" />
                        <Skeleton w="100px" h="70px" />
                        <Skeleton w="50px" h="20px" />
                    </HStack>
                </VStack>
            </CardBody>
        </Card>
    );
};
