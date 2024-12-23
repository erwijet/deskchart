import { Stack, Title } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { ClassroomEditor } from "components/classroom/classroom-editor";
import { ClassroomFormProvider, useClassroomForm } from "components/classroom/context";

export const Route = createFileRoute("/_auth/classrooms/create")({
    component: RouteComponent,
});

function RouteComponent() {
    const form = useClassroomForm({
        initialValues: { title: "", description: "", students: [] },
    });

    return (
        <Stack py="md">
            <Title order={2}>New Classroom</Title>
            <ClassroomFormProvider form={form}>
                <ClassroomEditor />
            </ClassroomFormProvider>
        </Stack>
    );
}
