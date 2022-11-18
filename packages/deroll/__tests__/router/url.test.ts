import { beforeEach, describe, expect, test } from "@jest/globals";

import { URLRouter, Handler } from "../../src/router/url";

describe("ABIRouter", () => {
    let router: URLRouter;

    beforeEach(() => {
        router = new URLRouter();
    });

    test("no routes", () => {
        const url = "test";
        expect(router.handle(url)).toBeUndefined();
    });

    test("simple route", () => {
        const handler: Handler = jest.fn((a, b) => "pong");
        const route = router.add(/ping/, handler);

        expect(router.handle("ping")).toBe("pong");
        expect(handler).toHaveBeenCalledWith(
            { index: 0, params: {}, path: "ping" },
            route
        );
    });

    test("single param", () => {
        const handler: Handler = jest.fn((a, b) => "pong");
        const route = router.add("tests/:id", handler);

        expect(router.handle("tests/123")).toBe("pong");
        expect(handler).toHaveBeenCalledWith(
            { index: 0, params: { id: "123" }, path: "tests/123" },
            route
        );
    });

    test("two params", () => {
        const handler: Handler = jest.fn((a, b) => "pong");
        const route = router.add("tests/:id/second/:name", handler);

        expect(router.handle("tests/123/second/cool")).toBe("pong");
        expect(handler).toHaveBeenCalledWith(
            {
                index: 0,
                params: { id: "123", name: "cool" },
                path: "tests/123/second/cool",
            },
            route
        );
    });

    test("typed params", () => {
        const handler: Handler<{ id: string }> = jest.fn((a, b) => a.params.id);
        const route = router.add("tests/:id", handler);

        expect(router.handle("tests/123")).toBe("123");
        expect(handler).toHaveBeenCalledWith(
            { index: 0, params: { id: "123" }, path: "tests/123" },
            route
        );
    });
});
