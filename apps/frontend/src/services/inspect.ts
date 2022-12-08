import { toUtf8String } from "@ethersproject/strings";
import useSWR, { Key, SWRResponse } from "swr";
import { useNetwork } from "wagmi";

const baseURL: Record<number, string> = {
    5: "https://ballaum.goerli.rollups.staging.cartesi.io/inspect",
    31337: "http://localhost:5005/inspect",
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
        network.chain ? `${baseURL[network.chain.id]}${key}` : false
    );

    const response = swr.data;
    let report = undefined;
    if (
        response &&
        response.status == InspectStatus.Accepted &&
        response.reports.length > 0
    ) {
        const r = response.reports[0];
        const data = toUtf8String(r.payload);
        report = JSON.parse(data) as TReport;
    }

    return { ...swr, report };
};
