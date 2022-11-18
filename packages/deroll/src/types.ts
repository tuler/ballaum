export type RequestType = "advance_state" | "inspect_state";

export type RequestMetadata = {
    msg_sender: string;
    epoch_index: number;
    input_index: number;
    block_number: number;
    timestamp: number;
};

export type RequestData = {
    metadata: RequestMetadata;
    payload: string;
};

export type Request = {
    request_type: RequestType;
    data: RequestData;
};

export type RequestHandlerResult = "accept" | "reject";

export type RequestHandler = (
    data: RequestData
) => RequestHandlerResult | Promise<RequestHandlerResult>;

export type NoticeRequest = {
    payload: string;
};

export type NoticeResponse = {
    index: number;
};

export type ReportRequest = {
    payload: string;
};

export type ReportResponse = {};

export type VoucherRequest = {
    address: string;
    payload: string;
};

export type VoucherResponse = {
    index: number;
};
