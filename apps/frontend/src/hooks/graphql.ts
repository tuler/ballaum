import { useQuery } from "urql";

import { VouchersDocument } from "../../generated-src/graphql/graphql";

export const useVouchers = () => {
    const [result] = useQuery({
        query: VouchersDocument,
    });

    return result;
};
