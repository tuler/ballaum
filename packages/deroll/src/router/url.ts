import { Key, match, MatchResult, MatchFunction, Path } from "path-to-regexp";

export type Handler<P extends object = object> = (
    match: MatchResult<P>,
    matchedRoute: Route<P>
) => string;

type Route<P extends object> = {
    matcher: MatchFunction<P>;
    handler: Handler<P>;
};

export class URLRouter {
    private routes: Route<any>[];

    constructor() {
        this.routes = [];
    }

    public add<P extends object>(path: Path, handler: Handler<P>): Route<P> {
        const keys: Key[] = [];
        const matcher = match<P>(path, { decode: decodeURIComponent });

        const route = { matcher, handler };
        this.routes.push(route);
        return route;
    }

    public handle(url: string): string | undefined {
        for (const route of this.routes) {
            const match = route.matcher(url);
            if (match) {
                return route.handler(match, route);
            }
        }
        return undefined;
    }
}
