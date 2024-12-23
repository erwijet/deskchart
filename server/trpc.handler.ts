import { defineEventHandler, toWebRequest } from "vinxi/http";
import { initTRPC, TRPCError } from "@trpc/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { z } from "zod";
import { createNotary } from "@erwijet/notary";
import { PrismaClient } from "@prisma/client";
import { runCatching } from "shared/fns";

const notary = createNotary({
    client: "deskchart",
    url: "https://notary.deskchart.app",
    callback: process.env.VITE_HOST + "/callback",
    key: process.env.VITE_NOTARY_KEY!,
});

const prisma = new PrismaClient();

const t = initTRPC.context<{ token: string }>().create();

const authenticated = t.procedure.use(async ({ ctx: { token }, next }) => {
    const auth = await runCatching(() => notary.inspect(token));
    if (!auth) throw new TRPCError({ code: "UNAUTHORIZED" });

    if (!auth?.valid) throw new TRPCError({ code: "UNAUTHORIZED" });

    return next({
        ctx: {
            user: auth.claims,
            userId: auth.claims.userId,
        },
    });
});

const appRouter = t.router({
    notary: {
        getAuthUrl: t.procedure.input(z.literal("google")).query(async ({ input: via }) => await notary.authorize({ via })),
        inspect: t.procedure.input(z.string()).query(async ({ input }) => await notary.inspect(input)),
    },

    classroom: {
        list: authenticated.query(async ({ ctx: { userId } }) => {
            console.log({ userId });
            const res = await prisma.class.findMany({ where: { ownerId: { equals: userId } } });
            console.log({ res });
            return res;
        }),
        create: authenticated
            .input(z.object({ title: z.string(), description: z.string() }))
            .mutation(({ ctx: { userId: ownerId }, input: { title, description } }) =>
                prisma.class.create({
                    data: { ownerId, title, description },
                }),
            ),
    },
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
