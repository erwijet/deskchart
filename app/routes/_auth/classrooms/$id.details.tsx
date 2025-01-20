import { createFileRoute, useParams } from "@tanstack/react-router";
import { Content } from "shared/components/content";
import { trpc } from "shared/trpc";

function Component() {
    const { id } = useParams({ from: "/_auth/classrooms/$id/details" });
    const [classroom] = trpc.classroom.details.useSuspenseQuery(id);

    return (
        <Content title={classroom.title} withBack>
            Detail Page
        </Content>
    );
}

export const Route = createFileRoute("/_auth/classrooms/$id/details")({
    component: Component,
    loader: ({ context: { trpcQC }, params: { id } }) => trpcQC.classroom.details.ensureData(id),
});
