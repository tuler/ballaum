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
import { useWaitForTransaction } from "wagmi";
import { Address, Hex } from "viem";
import {
    useCartesiDAppExecuteVoucher,
    usePrepareCartesiDAppExecuteVoucher,
} from "../../hooks/rollups";

import { FragmentType, useFragment } from "../../../generated-src/graphql";
import { shortAddress } from "../../components/address";
import { VoucherItemFragmentDoc } from "../../../generated-src/graphql/graphql";

export interface VoucherCardProps {
    dapp: Address;
    voucher: FragmentType<typeof VoucherItemFragmentDoc>;
}

export const VoucherCard: FC<VoucherCardProps> = ({
    dapp,
    voucher: voucherFragment,
}) => {
    const voucher = useFragment(VoucherItemFragmentDoc, voucherFragment);
    const { config, error: pError } = usePrepareCartesiDAppExecuteVoucher({
        enabled: !!voucher.proof, // only enabled if voucher has proof
        args: [
            voucher.destination as Address,
            voucher.payload as Hex,
            {
                validity: {
                    inputIndexWithinEpoch: BigInt(
                        voucher.proof?.validity.inputIndexWithinEpoch!,
                    ),
                    machineStateHash: voucher.proof?.validity
                        .machineStateHash as Hex,
                    noticesEpochRootHash: voucher.proof?.validity
                        .noticesEpochRootHash as Hex,
                    outputHashesInEpochSiblings: voucher.proof?.validity
                        .outputHashesInEpochSiblings as Hex[],
                    outputHashesRootHash: voucher.proof?.validity
                        .outputHashesRootHash as Hex,
                    outputHashInOutputHashesSiblings: voucher.proof?.validity
                        .outputHashInOutputHashesSiblings as Hex[],
                    outputIndexWithinInput: BigInt(
                        voucher.proof?.validity.outputIndexWithinInput!,
                    ),
                    vouchersEpochRootHash: voucher.proof?.validity
                        .vouchersEpochRootHash as Hex,
                },
                context: voucher.proof?.context as Hex,
            },
        ],
    });

    const { data: tx, write } = useCartesiDAppExecuteVoucher(config);
    const { data, error, isError, isLoading } = useWaitForTransaction(tx);

    return (
        <Card>
            <CardHeader>
                <Heading size="md">Voucher {voucher.index}</Heading>
            </CardHeader>
            <CardBody>
                <Text>Destination</Text>
                <Text fontWeight="bold">{voucher.destination}</Text>

                <Text mt={5}>Payload</Text>
                <Text fontWeight="bold">
                    {shortAddress(voucher.payload as Hex, 20)}
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
