import { defineEventHandler, toWebRequest } from "vinxi/http";
import { initTRPC, TRPCError } from "@trpc/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { z } from "zod";
import { createNotary } from "@erwijet/notary";

const notary = createNotary({
    client: "deskchart",
    url: "https://notary.deskchart.app",
    callback: process.env.VITE_HOST + "/callback",
    key: process.env.VITE_NOTARY_KEY!,
});

const t = initTRPC.context<{ token: string }>().create();

const authenticated = t.procedure.use(async ({ ctx: { token }, next }) => {
    const auth = await notary.inspect(token);
    if (!auth.valid) throw new TRPCError({ code: "UNAUTHORIZED" });

    return next({
        ctx: {
            user: auth.claims,
        },
    });
});

const appRouter = t.router({
    hello: t.procedure.query(() => "Hello world!"),
    notary: {
        getAuthUrl: t.procedure.input(z.literal("google")).query(async ({ input: via }) => await notary.authorize({ via })),
        inspect: t.procedure.input(z.string()).query(async ({ input }) => await notary.inspect(input)),
    },
    stuff: authenticated.query((opts) => opts.ctx.user),
});

export type AppRouter = typeof appRouter;

export default defineEventHandler((event) => {
    const request = toWebRequest(event);

    return fetchRequestHandler({
        endpoint: "/trpc",
        req: request,
        router: appRouter,
        async createContext({ req }) {
            const token = req.headers.get("Authorization")?.split("Bearer ")[1] ?? "";
            return { token };
        },
    });
});
