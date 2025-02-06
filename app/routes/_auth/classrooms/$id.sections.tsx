import { createFileRoute, useParams } from "@tanstack/react-router";
import { Content } from "shared/components/content";
import { trpc } from "shared/trpc";

function component() {
    const { id } = useParams({ from: "/_auth/classrooms/$id/sections" });
    const [classroom] = trpc.classroom.details.useSuspenseQuery(id);

    return (
        <Content title={classroom.title} withBack>
            your mom
        </Content>
    );
}

export const Route = createFileRoute("/_auth/classrooms/$id/sections")({
    component,
    loader: ({ context: { trpcQC }, params: { id } }) => trpcQC.classroom.details.ensureData(id),
});
