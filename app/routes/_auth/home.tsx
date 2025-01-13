import { Paper, Title } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { logger } from "shared/logger";

import { trpc } from "shared/trpc";

export const Route = createFileRoute("/_auth/home")({
    component: RouteComponent,
    loader: ({ context: { trpcQC: trpcQueryUtils } }) => {
        trpcQueryUtils.classroom.list.ensureData().catch(logger.log);
    },
});

function RouteComponent() {
    const [classrooms] = trpc.classroom.list.useSuspenseQuery();

    return (
        <div>
            {classrooms.map((classroom) => (
                <Paper key={classroom.id}>
                    <Title order={5}>{classroom.title}</Title>
                    <pre>{classroom.description}</pre>
                </Paper>
            ))}
        </div>
    );
}
