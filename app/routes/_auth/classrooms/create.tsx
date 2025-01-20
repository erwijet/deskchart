import { Button } from "@mantine/core";
import { zodResolver } from "@mantine/form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ClassroomEditor } from "components/classroom/classroom-editor";
import { ClassroomFormProvider, classroomSchema, useClassroomForm } from "components/classroom/context";
import { Save } from "lucide-react";
import { Content } from "shared/components/content";
import { logger } from "shared/logger";

import { trpc } from "shared/trpc";

export const Route = createFileRoute("/_auth/classrooms/create")({
    component: RouteComponent,
});

function RouteComponent() {
    const navigate = useNavigate();
    const { mutateAsync: createClassroom, isPending } = trpc.classroom.create.useMutation();

    const form = useClassroomForm({
        initialValues: { title: "", description: "", students: [] },
        validate: zodResolver(classroomSchema),
    });

    function handleCreate() {
        const { hasErrors } = form.validate();
        if (hasErrors) return;

        createClassroom({ ...form.getValues() })
            .then(({ id }) => navigate({ to: "/classrooms/$id/edit", params: { id } }))
            .catch(logger.error);
    }

    return (
        <Content withBack title="New Classroom">
            <Content.Action>
                <Button loading={isPending} leftSection={<Save size={16} />} onClick={handleCreate}>
                    Save
                </Button>
            </Content.Action>

            <ClassroomFormProvider form={form}>
                <ClassroomEditor />
            </ClassroomFormProvider>
        </Content>
    );
}
