import { Result } from "@ethersproject/abi";
import { ABIHeaderInputCodec, ABIInputCodec } from "@deroll/codec";

import { DAppOutput } from "../dapp";
import { RequestData, RequestHandlerResult, RequestMetadata } from "../types";
import { getAddress } from "@ethersproject/address";

export type Handler = (
    result: Result,
    metadata: RequestMetadata,
    matchedRoute: Route,
    dapp: DAppOutput
) => RequestHandlerResult | Promise<RequestHandlerResult>;

export class Route {
    public readonly codec: ABIInputCodec | ABIHeaderInputCodec;
    public readonly handler: Handler;

    constructor(codec: ABIInputCodec | ABIHeaderInputCodec, handler: Handler) {
        this.codec = codec;
        this.handler = handler;
    }

    public match(request: RequestData): boolean {
        if (
            this.codec.address !== undefined &&
            this.codec.address !== getAddress(request.metadata.msg_sender)
        ) {
            // no match if codec specifies an address that is not the request's sender
            return false;
        }
        if (this.codec instanceof ABIHeaderInputCodec) {
            // if codec specifies header, payload must have it
            return request.payload.startsWith(this.codec.header);
        }
        return true;
    }
}

// Router using ABI encoded values with a string keccak256 header
export class ABIRouter {
    private routes: Route[];

    constructor() {
        this.routes = [];
    }

    add(route: Route): Route {
        this.routes.push(route);
        return route;
    }

    handle(
        request: RequestData,
        dapp: DAppOutput
    ): RequestHandlerResult | Promise<RequestHandlerResult> {
        for (const route of this.routes) {
            if (route.match(request)) {
                // 🤜🤛 match
                const result = route.codec.decode(request.payload);
                return route.handler(result, request.metadata, route, dapp);
            }
        }
        // reject if input in unknown/invalid (no matching route)
        return "reject";
    }
}
