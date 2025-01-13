import { Button } from "@mantine/core";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { ClassroomEditor } from "shared/components/classroom/classroom-editor";
import { ClassroomFormProvider, useClassroomForm } from "shared/components/classroom/context";
import { Content } from "shared/components/content";
import { logger } from "shared/logger";

import { trpc } from "shared/trpc";

export const Route = createFileRoute("/_auth/classrooms/edit/$id")({
    loader: ({ context: { trpcQC: trpcQueryUtils }, params: { id } }) => {
        trpcQueryUtils.classroom.byId.ensureData(id).catch(logger.log);
    },
    component: RouteComponent,
});

function RouteComponent() {
    const { id } = useParams({ from: "/_auth/classrooms/edit/$id" });
    const [classroom] = trpc.classroom.byId.useSuspenseQuery(id);

    const form = useClassroomForm({ initialValues: classroom });

    return (
        <Content withBack title={classroom.title}>
            <Content.Action>
                <Button variant="subtle">Delete</Button>
            </Content.Action>

            <Content.Action>
                <Button>Save</Button>
            </Content.Action>

            <ClassroomFormProvider form={form}>
                <ClassroomEditor />
            </ClassroomFormProvider>
        </Content>
    );
}
