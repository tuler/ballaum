import { Result } from "@ethersproject/abi";
import { ABIInputCodec } from "@deroll/codec";

import { DAppOutput } from "../dapp";
import { RequestData, RequestHandlerResult, RequestMetadata } from "../types";

export type Handler = (
    result: Result,
    metadata: RequestMetadata,
    matchedRoute: Route,
    dapp: DAppOutput
) => RequestHandlerResult | Promise<RequestHandlerResult>;

export class Route {
    public readonly codec: ABIInputCodec;
    public readonly handler: Handler;

    constructor(codec: ABIInputCodec, handler: Handler) {
        this.codec = codec;
        this.handler = handler;
    }

    public match(payload: string): boolean {
        return payload.startsWith(this.codec.header);
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
        const payload = request.payload;
        for (const route of this.routes) {
            if (route.match(payload)) {
                // 🤜🤛 match
                const result = route.codec.decode(payload);
                return route.handler(result, request.metadata, route, dapp);
            }
        }
        // XXX: do we accept or reject an unknown input?
        return "accept";
    }
}
