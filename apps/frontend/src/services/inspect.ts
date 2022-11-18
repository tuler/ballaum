import { utils } from "ethers";

const baseUrl = "http://localhost:5005/inspect";

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

export const inspect = async <R>(route: string): Promise<R | undefined> => {
    const res = await fetch(`${baseUrl}${route}`);
    if (res.ok) {
        const response = (await res.json()) as InspectResponse;
        if (
            response.status == InspectStatus.Accepted &&
            response.reports.length > 0
        ) {
            const report = response.reports[0];
            const data = utils.toUtf8String(report.payload);
            return JSON.parse(data) as R;
        }
    }
};
