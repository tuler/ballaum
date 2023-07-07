import { beforeEach, describe, expect, test } from "@jest/globals";
import { AddressZero } from "@ethersproject/constants";

import { ABIInputCodec } from "@deroll/codec";
import { ABIRouter, Handler, Route } from "../../src/router/abi";
import { RequestData } from "../../src/types";
import { DAppOutput } from "../../src";

const ADDRESS_1 = "0xA89A3216F46F66486C9B794C1e28d3c44D59591e";
const ADDRESS_2 = "0x4340ac4FcdFC5eF8d34930C96BBac2Af1301DF40";
const FRAMEWORK_1 = "framework-1";
const FRAMEWORK_2 = "framework-2";
const METHOD_1 = "method-1";
const METHOD_2 = "method-2";

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
        expect(router.handle(request, dapp)).toBe("reject");
    });

    test("single route accept", () => {
        const handler: Handler = jest.fn(() => {
            return "accept";
        });
        const types = ["string", "uint8"];
        const values = ["Hey", 128];
        const codec = new ABIInputCodec(types, false);
        const route = router.add(new Route(codec, handler, ADDRESS_1));

        const metadata = {
            block_number: 0,
            epoch_index: 1,
            input_index: 2,
            msg_sender: ADDRESS_1,
            timestamp: Date.now(),
        };
        const request: RequestData = {
            metadata,
            payload: route.codec.encode(values),
        };
        expect(router.handle(request, dapp)).toBe("accept");
        expect(handler).toHaveBeenCalledWith(values, metadata, route, dapp);
    });

    test("single route accept address formatting", () => {
        const handler: Handler = jest.fn(() => {
            return "accept";
        });
        const types = ["string", "uint8"];
        const values = ["Hey", 128];
        const codec = new ABIInputCodec(types, false);
        const route = router.add(new Route(codec, handler, ADDRESS_1));

        const metadata = {
            block_number: 0,
            epoch_index: 1,
            input_index: 2,
            msg_sender: ADDRESS_1.toLowerCase(),
            timestamp: Date.now(),
        };
        const request: RequestData = {
            metadata,
            payload: route.codec.encode(values),
        };
        expect(router.handle(request, dapp)).toBe("accept");
        expect(handler).toHaveBeenCalledWith(values, metadata, route, dapp);
    });

    test("single route reject", () => {
        const handler: Handler = jest.fn(() => {
            return "accept";
        });
        const types = ["string", "uint8"];
        const values = ["Hey", 128];
        const codec = new ABIInputCodec(types, false);
        const route = router.add(new Route(codec, handler, ADDRESS_1));

        // incorrect sender address
        const metadata = {
            block_number: 0,
            epoch_index: 1,
            input_index: 2,
            msg_sender: ADDRESS_2,
            timestamp: Date.now(),
        };
        const request: RequestData = {
            metadata,
            payload: route.codec.encode(values),
        };
        expect(router.handle(request, dapp)).toBe("reject");
        expect(handler).toHaveBeenCalledTimes(0);
    });

    test("two routes simple", () => {
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
            msg_sender: ADDRESS_1,
            timestamp: Date.now(),
        };

        const routeA = router.add(
            new Route(new ABIInputCodec([], false), handlerA, ADDRESS_1)
        );
        router.add(
            new Route(new ABIInputCodec([], false), handlerB, ADDRESS_2)
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

    test("two routes headers", () => {
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
            msg_sender: ADDRESS_1,
            timestamp: Date.now(),
        };

        const routeA = router.add(
            new Route(
                new ABIInputCodec([], false, [FRAMEWORK_1, METHOD_1]),
                handlerA
            )
        );
        router.add(
            new Route(
                new ABIInputCodec([], false, [FRAMEWORK_2, METHOD_2]),
                handlerB
            )
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

    test("muliple routes", () => {
        const handlerA: Handler = jest.fn(() => {
            return "accept";
        });
        const handlerB: Handler = jest.fn(() => {
            return "reject";
        });
        const handlerC: Handler = jest.fn(() => {
            return "reject";
        });
        const handlerD: Handler = jest.fn(() => {
            return "reject";
        });
        const handlerE: Handler = jest.fn(() => {
            return "reject";
        });

        const metadata = {
            block_number: 0,
            epoch_index: 1,
            input_index: 2,
            msg_sender: ADDRESS_1,
            timestamp: Date.now(),
        };

        const routeA = router.add(
            new Route(
                new ABIInputCodec([], false, [FRAMEWORK_1, METHOD_1]),
                handlerA,
                ADDRESS_1
            )
        );
        router.add(
            new Route(new ABIInputCodec([], false), handlerB, ADDRESS_2)
        );
        router.add(
            new Route(
                new ABIInputCodec([], false, [FRAMEWORK_1, METHOD_1]),
                handlerC,
                ADDRESS_2
            )
        );
        router.add(
            new Route(
                new ABIInputCodec([], false, [FRAMEWORK_1, METHOD_2]),
                handlerD,
                ADDRESS_1
            )
        );
        router.add(
            new Route(
                new ABIInputCodec([], false, [FRAMEWORK_2, METHOD_2]),
                handlerE
            )
        );

        const payload = routeA.codec.encode([]);
        const request: RequestData = {
            metadata,
            payload,
        };

        expect(router.handle(request, dapp)).toBe("accept");
        expect(handlerB).toHaveBeenCalledTimes(0);
        expect(handlerC).toHaveBeenCalledTimes(0);
        expect(handlerD).toHaveBeenCalledTimes(0);
        expect(handlerE).toHaveBeenCalledTimes(0);
        expect(handlerA).toHaveBeenCalledWith([], metadata, routeA, dapp);
    });
});
