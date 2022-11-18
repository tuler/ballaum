import { beforeEach, describe, expect, test } from "@jest/globals";
import { AddressZero } from "@ethersproject/constants";

import { ABIInputCodec } from "@deroll/codec";
import { ABIRouter, Handler, Route } from "../../src/router/abi";
import { RequestData } from "../../src/types";
import { DAppOutput } from "../../src";

describe("ABIRouter", () => {
    let dapp: DAppOutput;
    let router: ABIRouter;

    beforeEach(() => {
        router = new ABIRouter();
        dapp = {
            createNotice: jest.fn(),
            createReport: jest.fn(),
            createVoucher: jest.fn(),
        };
    });

    test("no routes", () => {
        const metadata = {
            block_number: 0,
            epoch_index: 1,
            input_index: 2,
            msg_sender: AddressZero,
            timestamp: Date.now(),
        };
        const request = {
            metadata,
            payload: "",
        };
        expect(router.handle(request, dapp)).toBe("accept");
    });

    test("single route", () => {
        const handler: Handler = jest.fn(() => {
            return "accept";
        });
        const types = ["string", "uint8"];
        const values = ["Hey", 128];
        const codec = new ABIInputCodec("Test", types);
        const route = router.add(new Route(codec, handler));

        const metadata = {
            block_number: 0,
            epoch_index: 1,
            input_index: 2,
            msg_sender: AddressZero,
            timestamp: Date.now(),
        };
        const request: RequestData = {
            metadata,
            payload: route.codec.encode(values),
        };
        expect(router.handle(request, dapp)).toBe("accept");
        expect(handler).toHaveBeenCalledWith(values, metadata, route, dapp);
    });

    test("two routes", () => {
        const handlerA: Handler = jest.fn(() => {
            return "accept";
        });
        const handlerB: Handler = jest.fn(() => {
            return "reject";
        });

        const metadata = {
            block_number: 0,
            epoch_index: 1,
            input_index: 2,
            msg_sender: AddressZero,
            timestamp: Date.now(),
        };

        router.add(new Route(new ABIInputCodec("Test", []), handlerB));
        const routeA = router.add(
            new Route(new ABIInputCodec("Test2", []), handlerA)
        );

        const payload = routeA.codec.encode([]);
        const request: RequestData = {
            metadata,
            payload,
        };

        expect(router.handle(request, dapp)).toBe("accept");
        expect(handlerB).toHaveBeenCalledTimes(0);
        expect(handlerA).toHaveBeenCalledWith([], metadata, routeA, dapp);
    });
});
