import useSWR, { Key, SWRResponse } from "swr";
import { useNetwork } from "wagmi";
import { bytesToString, toBytes } from "viem";

const baseURL: Record<number, string> = {
    11155111: "https://ballaum.sepolia.rollups.staging.cartesi.io/inspect",
    31337: "http://localhost:8080/inspect",
};

export enum InspectStatus {
    Accepted = "Accepted",
    Rejected = "Rejected",
    Exception = "Exception",
    MachineHalted = "MachineHalted",
    CycleLimitExceeded = "CycleLimitExceeded",
    TimeLimitExceeded = "TimeLimitExceeded",
}

export interface InspectReport {
    payload: string;
}

export interface InspectMetadata {
    active_epoch_index: number;
    current_input_index: number;
}

export interface InspectResponse {
    status: InspectStatus;
    exception_payload: string;
    reports: InspectReport[];
    metadata: InspectMetadata;
}

type ReportResponse<TReport> = {
    report?: TReport;
};

export type UseInspect<TReport> = SWRResponse<InspectResponse> &
    ReportResponse<TReport>;

export const useInspect = <TReport>(key: Key): UseInspect<TReport> => {
    // get connected network (if any)
    const network = useNetwork();

    // fetch only if connected to valid chain
    const swr = useSWR<InspectResponse>(() =>
        network.chain && key ? `${baseURL[network.chain.id]}${key}` : false,
    );

    const response = swr.data;
    let report = undefined;
    if (
        response &&
        response.status == InspectStatus.Accepted &&
        response.reports.length > 0
    ) {
        const r = response.reports[0];
        const data = bytesToString(toBytes(r.payload));
        report = JSON.parse(data) as TReport;
    }

    return { ...swr, report };
};
