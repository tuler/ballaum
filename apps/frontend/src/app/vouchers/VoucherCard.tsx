import { FC } from "react";
import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Button,
    ButtonGroup,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Heading,
    Text,
    Textarea,
} from "@chakra-ui/react";

import { FragmentType, useFragment } from "../../../generated-src/graphql";
import { shortAddress } from "../../components/address";
import {
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
} from "wagmi";
import { CartesiDApp__factory } from "@cartesi/rollups";
import { VoucherItemFragmentDoc } from "../../../generated-src/graphql/graphql";

export interface VoucherCardProps {
    dapp: string;
    voucher: FragmentType<typeof VoucherItemFragmentDoc>;
}

export const VoucherCard: FC<VoucherCardProps> = ({
    dapp,
    voucher: voucherFragment,
}) => {
    const voucher = useFragment(VoucherItemFragmentDoc, voucherFragment);
    const { config, error: pError } = usePrepareContractWrite({
        address: dapp,
        abi: CartesiDApp__factory.abi,
        functionName: "executeVoucher",
        enabled: !!voucher.proof, // only enabled if voucher has proof
        args: [
            voucher.destination as `0x${string}`,
            voucher.payload as `0x${string}`,
            voucher.proof as any
        ],
    });

    const { data: tx, write } = useContractWrite(config);
    const { data, error, isError, isLoading } = useWaitForTransaction(tx);

    return (
        <Card>
            <CardHeader>
                <Heading size="md">Voucher ${voucher.index} from input {`${voucher.input.index}`}</Heading>
            </CardHeader>
            <CardBody>
                <Text>Destination</Text>
                <Text fontWeight="bold">{voucher.destination}</Text>

                <Text mt={5}>Payload</Text>
                <Text fontWeight="bold">
                    {shortAddress(voucher.payload, 20)}
                </Text>
                {pError && pError.message && (
                    <Alert status="error" mt={5}>
                        <AlertIcon />
                        <AlertTitle>{pError.name}</AlertTitle>
                        <AlertDescription>
                            <Textarea height={200}>{pError.message}</Textarea>
                        </AlertDescription>
                    </Alert>
                )}
                {error && error.message && (
                    <Alert status="error" mt={5}>
                        <AlertIcon />
                        <AlertTitle>{error.name}</AlertTitle>
                        <AlertDescription>{error.message}</AlertDescription>
                    </Alert>
                )}
                {!voucher.proof && (
                    <Alert status="warning" mt={5}>
                        <AlertIcon />
                        <AlertTitle>Proof</AlertTitle>
                        <AlertDescription>
                            Voucher has no proof yet
                        </AlertDescription>
                    </Alert>
                )}
            </CardBody>
            <CardFooter>
                <ButtonGroup>
                    <Button
                        onClick={() => write?.()}
                        colorScheme="purple"
                        disabled={!write}
                        loadingText="Executing..."
                        isLoading={isLoading}
                    >
                        Execute
                    </Button>
                </ButtonGroup>
            </CardFooter>
        </Card>
    );
};
