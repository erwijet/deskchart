import { createNotary, Notary } from "@erwijet/notary";
import { $Enums, PrismaClient } from "@prisma/client";
import { initTRPC, TRPCError } from "@trpc/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { TRPC_ERROR_CODE_KEY } from "@trpc/server/dist/rpc";
import { arr, runCatching } from "shared/fns";
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
        return (t: T) => t ?? fail("NOT_FOUND");
    },
};

function fail<T>(code: TRPC_ERROR_CODE_KEY): NonNullable<T> {
    throw new TRPCError({ code });
}

function ok() {
    return { ok: true };
}

function createNotaryTrpcAuthenticationPlugin({ notary }: { notary: Notary }) {
    const t = initTRPC.context<{ token: string }>().create();

    return t.procedure.use(async ({ ctx: { token }, next }) => {
        const auth = await runCatching(() => notary.inspect(token));

        if (!auth?.valid) throw fail("UNAUTHORIZED");

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
            prisma.classroom.findMany({ where: { ownerId }, include: { sections: true } }),
        ),
        details: authenticated.input(z.string()).query(({ ctx: { userId: ownerId }, input: id }) =>
            prisma.classroom
                .findFirst({
                    where: { ownerId, id },
                    include: { pods: { include: { seats: true } }, sections: { include: { students: true } }, entities: true },
                })
                .then(ensure.nonnull()),
        ),
        create: authenticated
            .input(z.object({ title: z.string() }))
            .mutation(({ ctx: { userId: ownerId }, input }) => prisma.classroom.create({ data: { ownerId, ...input } })),
        settings: {
            save: authenticated
                .input(
                    z.object({
                        id: z.string(),
                        title: z.string(),
                        pods: z
                            .object({
                                id: z.string(),
                                title: z.string(),
                                hex: z.string(),
                            })
                            .array(),
                    }),
                )
                .mutation(async ({ ctx: { userId: ownerId }, input: { id, title, pods } }) =>
                    prisma.classroom.update({
                        where: { id, ownerId },
                        include: { pods: true },
                        data: {
                            title,
                            pods: {
                                deleteMany: {},
                                createMany: { data: pods },
                            },
                        },
                    }),
                ),
        },
        setDetails: authenticated
            .input(
                z.object({
                    id: z.string(),
                    title: z.string(),
                    pods: z
                        .object({
                            title: z.string(),
                            hex: z.string(),
                            seats: z
                                .object({
                                    col: z.number(),
                                    row: z.number(),
                                })
                                .array(),
                        })
                        .array(),
                    entities: z
                        .object({
                            type: z.nativeEnum($Enums.EntityType),
                            dir: z.nativeEnum($Enums.NodeDirection),
                            col: z.number(),
                            row: z.number(),
                        })
                        .array(),
                }),
            )
            .mutation(({ ctx: { userId: ownerId }, input: { id, title, pods, entities } }) => {
                prisma.classroom.update({
                    where: { id, ownerId },
                    include: { pods: true },
                    data: {
                        title,
                        entities: { create: entities },
                        pods: {
                            create: pods.map((p) => ({ ...p, seats: { create: p.seats } })),
                        },
                    },
                });

                return ok();
            }),
        setSections: authenticated
            .input(
                z.object({
                    id: z.string(),
                    sections: z.object({ title: z.string(), students: z.object({ gn: z.string(), sn: z.string() }).array() }).array(),
                }),
            )
            .mutation(async ({ ctx: { userId: ownerId }, input: { id, sections } }) => {
                const classroom = await prisma.classroom.findFirst({ where: { id, ownerId } }).then(ensure.nonnull());

                await prisma.$transaction(
                    [
                        prisma.section.deleteMany({ where: { classId: classroom.id } }),
                        ...sections.map((section) =>
                            prisma.section.create({
                                data: {
                                    title: section.title,
                                    classId: classroom.id,
                                    students: {
                                        create: section.students.map((student) => ({ ownerId, ...student })),
                                    },
                                },
                            }),
                        ),
                    ],
                    { isolationLevel: "ReadCommitted" },
                );

                return ok();
            }),
        setLayout: authenticated
            .input(
                z.object({
                    id: z.string(),
                    seats: z.object({ id: z.string(), row: z.number().int(), col: z.number().int(), podId: z.string() }).array(),
                    entities: z
                        .object({
                            id: z.string(),
                            row: z.number().int(),
                            col: z.number().int(),
                            entityType: z.enum(["DOOR", "WHITEBOARD", "TEACHER"]),
                        })
                        .array(),
                }),
            )
            .mutation(async ({ ctx: { userId: ownerId }, input: { id, entities, seats } }) => {
                const classroom = await prisma.classroom
                    .findFirst({ where: { id, ownerId }, include: { pods: { include: { seats: true } }, entities: true } })
                    .then(ensure.nonnull());

                // (1) delete any old seats not present in our input
                await Promise.all(
                    arr(classroom.pods.flatMap((it) => it.seats))
                        .to("id")
                        .minus(arr(seats).to("id"))
                        .get()
                        .map((id) => prisma.seat.delete({ where: { id } })),
                );

                // (2) do the same for entities
                await Promise.all(
                    arr(classroom.entities)
                        .to("id")
                        .minus(arr(entities).to("id"))
                        .get()
                        .map((id) => prisma.entity.delete({ where: { id } })),
                );

                // (3) upsert seats
                await Promise.all(seats.map((s) => prisma.seat.upsert({ where: { id: s.id }, create: s, update: s })));

                // (4) ...and entities
                await Promise.all(
                    entities.map(({ id, col, row, entityType }) =>
                        prisma.entity.upsert({
                            where: { id },
                            create: { id, col, row, type: entityType, dir: "VERTICAL", classroomId: classroom.id },
                            update: { col, row, type: entityType },
                        }),
                    ),
                );
            }),
        delete: authenticated
            .input(z.string())
            .mutation(({ ctx: { userId: ownerId }, input: id }) => prisma.classroom.delete({ where: { id, ownerId } })),
    },

    // classroom: {
    //     list: authenticated.query(({ ctx: { userId: ownerId } }) =>
    //         prisma.class.findMany({ where: { ownerId }, include: { students: true } }),
    //     ),
    //     byId: authenticated
    //         .input(z.string())
    //         .query(({ ctx: { userId: ownerId }, input: id }) =>
    //             prisma.class.findFirst({ where: { id, ownerId }, include: { students: true, layouts: true } }).then(ensure.nonnull()),
    //         ),
    //     create: authenticated
    //         .input(z.object({ title: z.string(), description: z.string(), students: z.object({ gn: z.string(), sn: z.string() }).array() }))
    //         .mutation(({ ctx: { userId: ownerId }, input: { title, description, students } }) =>
    //             prisma.class.create({
    //                 data: {
    //                     ownerId,
    //                     title,
    //                     description,
    //                     students: { createMany: { data: students.map((each) => ({ ...each, ownerId })) } },
    //                 },
    //             }),
    //         ),
    // },
    // layout: {
    //     byId: authenticated
    //         .input(z.string().cuid())
    //         .query(({ ctx: { userId: ownerId }, input: id }) =>
    //             prisma.layout
    //                 .findFirst({ where: { id, class: { ownerId } }, include: { class: true, pods: { include: { seats: true } } } })
    //                 .then(ensure.nonnull()),
    //         ),
    //     create: authenticated
    //         .input(z.object({ title: z.string(), classId: z.string().cuid() }))
    //         .mutation(({ ctx: { userId: ownerId }, input: { title, classId } }) =>
    //             prisma.class
    //                 .findFirstOrThrow({ where: { id: classId, ownerId } })
    //                 .then(ensure.nonnull())
    //                 .then(() =>
    //                     prisma.layout.create({
    //                         data: {
    //                             title,
    //                             classId,
    //                             height: 0,
    //                             width: 0,
    //                         },
    //                     }),
    //                 )

    //                 .catch(() => orThrow("CONFLICT")),
    //         ),
    //     update: authenticated
    //         .input(z.object({ id: z.string().cuid(), title: z.string(), description: z.string().optional().default("") }))
    //         .mutation(({ ctx: { userId: ownerId }, input: { id, title } }) =>
    //             prisma.layout.update({ where: { id, class: { ownerId } }, data: { title } }),
    //         ),
    //     delete: authenticated
    //         .input(z.string().cuid())
    //         .mutation(({ ctx: { userId: ownerId }, input: id }) => prisma.layout.delete({ where: { id, class: { ownerId } } })),
    //     byClassroom: authenticated.input(z.string()).query(({ ctx: { userId: ownerId }, input: id }) =>
    //         prisma.class
    //             .findFirst({ where: { id, ownerId }, include: { layouts: true } })
    //             .then(ensure.nonnull())
    //             .then(({ layouts }) => layouts),
    //     ),
    // },
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
