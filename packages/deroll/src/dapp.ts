import { getAddress } from "@ethersproject/address";
import { hexlify } from "@ethersproject/bytes";
import { toUtf8Bytes, toUtf8String } from "@ethersproject/strings";

import { ABIRouter, URLRouter } from "./router";
import {
    NoticeRequest,
    NoticeResponse,
    ReportRequest,
    Request,
    RequestHandler,
    VoucherRequest,
    VoucherResponse,
} from "./types";
import { WalletApp } from "./wallet";

export interface DAppOutput {
    createNotice(request: NoticeRequest): Promise<number>;
    createReport(request: ReportRequest): Promise<void>;
    createVoucher(request: VoucherRequest): Promise<number>;
}

export class DApp implements DAppOutput {
    private serverUrl: string;

    private rollupAddress: string | undefined;

    public readonly inspectRouter: URLRouter;

    public readonly inputRouter: ABIRouter;

    public readonly wallet: WalletApp;

    constructor(serverUrl: string) {
        this.serverUrl = serverUrl;
        this.rollupAddress = undefined;
        this.wallet = new WalletApp(false); // XXX: do not verify yet, running host mode for testing
        this.inspectRouter = new URLRouter();
        this.inputRouter = new ABIRouter();
        this.inputRouter.add(this.wallet.depositEtherRoute);
        this.inputRouter.add(this.wallet.withdrawEtherRoute);
    }

    public getRollupAddress(): Readonly<string | undefined> {
        return this.rollupAddress;
    }

    private async create<T, R>(url: string, request: T): Promise<R> {
        const response = await fetch(`${this.serverUrl}${url}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(request),
        });
        if (response.ok) {
            return response.json();
        } else {
            throw new Error(response.statusText);
        }
    }

    public async createNotice(request: NoticeRequest): Promise<number> {
        const response: NoticeResponse = await this.create("/notice", request);
        return response.index;
    }

    public async createReport(request: ReportRequest): Promise<void> {
        const response = await fetch(`${this.serverUrl}/report`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(request),
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
    }

    public async createVoucher(request: VoucherRequest): Promise<number> {
        const response: VoucherResponse = await this.create(
            "/voucher",
            request
        );
        return response.index;
    }

    private handle_advance: RequestHandler = async (data) => {
        console.log(`received advance request data ${JSON.stringify(data)}`);
        try {
            return this.inputRouter.handle(data, this);
        } catch (e) {
            console.log(e);
            return "reject";
        }
    };

    private handle_inspect: RequestHandler = async (data) => {
        console.log(`received inspect request data ${JSON.stringify(data)}`);
        try {
            const url = toUtf8String(data.payload);
            const result = this.inspectRouter.handle(url);
            if (result) {
                await this.createReport({
                    payload: hexlify(toUtf8Bytes(result)),
                });
            }
            return "accept";
        } catch (e) {
            console.error(e);
            return "reject";
        }
    };

    public async start(): Promise<void> {
        let finish = { status: "accept" };
        while (true) {
            console.log("sending finish");
            const finish_req = await fetch(`${this.serverUrl}/finish`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ status: "accept" }),
            });
            console.log(`received finish status ${finish_req.status}`);

            if (finish_req.status == 202) {
                console.log("no pending rollup request, trying again");
            } else {
                const rollup_req: Request = await finish_req.json();
                const metadata = rollup_req.data.metadata;
                if (
                    metadata &&
                    metadata.epoch_index == 0 &&
                    metadata.input_index == 0
                ) {
                    this.rollupAddress = getAddress(metadata.msg_sender);

                    // now we know what is the rollups address (which is also the portal address)
                    this.wallet.setPortalAddress(this.rollupAddress);

                    console.log(
                        `captured rollup address: ${this.rollupAddress}`
                    );
                } else {
                    switch (rollup_req.request_type) {
                        case "inspect_state":
                            finish["status"] = await this.handle_inspect(
                                rollup_req.data
                            );
                            break;
                        case "advance_state":
                            finish["status"] = await this.handle_advance(
                                rollup_req.data
                            );
                            break;
                    }
                }
            }
        }
    }
}
