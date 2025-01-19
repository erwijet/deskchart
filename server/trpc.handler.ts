import { createNotary, Notary } from "@erwijet/notary";
import { PrismaClient } from "@prisma/client";
import { initTRPC, TRPCError } from "@trpc/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { TRPC_ERROR_CODE_KEY } from "@trpc/server/dist/rpc";
import { runCatching } from "shared/fns";
import { defineEventHandler, toWebRequest } from "vinxi/http";
import { z } from "zod";

const notary = createNotary({
    client: "deskchart",
    url: "https://notary.deskchart.app",
    callback: process.env.VITE_HOST + "/callback",
    key: process.env.VITE_NOTARY_KEY!,
});

const prisma = new PrismaClient();

const t = initTRPC.context<{ token: string }>().create();

const ensure = {
    nonnull<T>(): (t: T) => NonNullable<T> {
        return (t: T) => {
            if (!!t) return t;
            throw new TRPCError({ code: "NOT_FOUND" });
        };
    },
};

function orThrow<T>(code: TRPC_ERROR_CODE_KEY): T {
    throw new TRPCError({ code });
}

function createNotaryTrpcAuthenticationPlugin({ notary }: { notary: Notary }) {
    const t = initTRPC.context<{ token: string }>().create();

    return t.procedure.use(async ({ ctx: { token }, next }) => {
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
}

const authenticated = t.procedure.unstable_concat(createNotaryTrpcAuthenticationPlugin({ notary }));

const appRouter = t.router({
    session: {
        get: authenticated.query(({ ctx: { user } }) => ({
            user,
        })),
        authenticate: t.procedure.input(z.literal("google")).query(({ input: via }) => notary.authenticate({ via })),
        renew: authenticated.query(({ ctx: { token } }) => notary.renew(token)),
    },
    classroom: {
        list: authenticated.query(({ ctx: { userId: ownerId } }) =>
            prisma.class.findMany({ where: { ownerId }, include: { students: true } }),
        ),
        byId: authenticated
            .input(z.string())
            .query(({ ctx: { userId: ownerId }, input: id }) =>
                prisma.class.findFirst({ where: { id, ownerId }, include: { students: true, layouts: true } }).then(ensure.nonnull()),
            ),
        create: authenticated
            .input(z.object({ title: z.string(), description: z.string(), students: z.object({ gn: z.string(), sn: z.string() }).array() }))
            .mutation(({ ctx: { userId: ownerId }, input: { title, description, students } }) =>
                prisma.class.create({
                    data: {
                        ownerId,
                        title,
                        description,
                        students: { createMany: { data: students.map((each) => ({ ...each, ownerId })) } },
                    },
                }),
            ),
    },
    layout: {
        byId: authenticated
            .input(z.string().cuid())
            .query(({ ctx: { userId: ownerId }, input: id }) =>
                prisma.layout
                    .findFirst({ where: { id, class: { ownerId } }, include: { class: true, pods: { include: { seats: true } } } })
                    .then(ensure.nonnull()),
            ),
        create: authenticated
            .input(z.object({ title: z.string(), classId: z.string().cuid() }))
            .mutation(({ ctx: { userId: ownerId }, input: { title, classId } }) =>
                prisma.class
                    .findFirstOrThrow({ where: { id: classId, ownerId } })
                    .then(ensure.nonnull())
                    .then(() =>
                        prisma.layout.create({
                            data: {
                                title,
                                classId,
                                height: 0,
                                width: 0,
                            },
                        }),
                    )

                    .catch(() => orThrow("CONFLICT")),
            ),
        update: authenticated
            .input(z.object({ id: z.string().cuid(), title: z.string(), description: z.string().optional().default("") }))
            .mutation(({ ctx: { userId: ownerId }, input: { id, title } }) =>
                prisma.layout.update({ where: { id, class: { ownerId } }, data: { title } }),
            ),
        delete: authenticated
            .input(z.string().cuid())
            .mutation(({ ctx: { userId: ownerId }, input: id }) => prisma.layout.delete({ where: { id, class: { ownerId } } })),
        byClassroom: authenticated.input(z.string()).query(({ ctx: { userId: ownerId }, input: id }) =>
            prisma.class
                .findFirst({ where: { id, ownerId }, include: { layouts: true } })
                .then(ensure.nonnull())
                .then(({ layouts }) => layouts),
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
