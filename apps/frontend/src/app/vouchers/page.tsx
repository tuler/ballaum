"use client";

import { FC } from "react";
import { Spinner, VStack } from "@chakra-ui/react";

import { useVouchers } from "../../hooks/graphql";
import { VoucherCard } from "./VoucherCard";
import { useDAppAddress } from "../../hooks/contract";

const VouchersPage: FC = () => {
    const dapp = useDAppAddress();
    const vouchers = useVouchers();

    return (
        <VStack spacing={4}>
            {vouchers.fetching && <Spinner />}
            {vouchers.data &&
                dapp &&
                vouchers.data.vouchers.nodes.map((voucher, i) => (
                    <VoucherCard
                        key={`voucher-${i}`}
                        voucher={voucher}
                        dapp={dapp}
                    />
                ))}
        </VStack>
    );
};

export default VouchersPage;
