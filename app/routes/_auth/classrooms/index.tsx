import { Button, Group, List, Stack, Text, TextInput, Title } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { modals } from "@mantine/modals";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Content } from "shared/components/content";
import { runVoiding } from "shared/fns";
import { usePromiseTracker } from "shared/hooks/use-promise-tracker";
import { logger } from "shared/logger";
import { trpc } from "shared/trpc";
import { z } from "zod";

function component() {
    const [classrooms, { refetch }] = trpc.classroom.list.useSuspenseQuery();
    const { mutateAsync: create } = trpc.classroom.create.useMutation();

    function handleCreate() {
        modals.open({
            title: "Create Classroom",
            children: <ClassroomBuilder onCreate={(title) => create(title).then(runVoiding(refetch))} />,
        });
    }

    return (
        <Content title="My Classrooms">
            <Content.Action>
                <Button component="div" variant="default" leftSection={<Plus size={16} />} onClick={handleCreate}>
                    Create
                </Button>
            </Content.Action>

            <Stack>
                {classrooms.map((classroom) => (
                    <Stack gap="xs" key={classroom.id}>
                        <Group justify="space-between">
                            <Title order={4}>{classroom.title}</Title>
                            <Group gap={0}>
                                <Link to="/classrooms/$id/sections" params={{ id: classroom.id }}>
                                    <Button variant="transparent" size="compact-md">
                                        Sections
                                    </Button>
                                </Link>
                                <Link to="/classrooms/$id/layout" params={{ id: classroom.id }}>
                                    <Button variant="transparent" size="compact-md">
                                        Layout
                                    </Button>
                                </Link>
                            </Group>
                        </Group>

                        {!classroom.sections.length && (
                            <Text c="dimmed" size="xs" mt="-xs" fs="italic">
                                No Sections
                            </Text>
                        )}

                        <List>
                            {classroom.sections.map((section) => (
                                <List.Item key={section.id}>{section.title}</List.Item>
                            ))}
                        </List>
                    </Stack>
                ))}
            </Stack>
        </Content>
    );
}

const ClassroomBuilder = (props: { onCreate: (data: { title: string }) => Promise<unknown> }) => {
    const form = useForm({
        initialValues: { title: "" },
        validate: zodResolver(z.object({ title: z.string().nonempty({ message: "This field is required" }) })),
    });
    const { run: create, isLoading } = usePromiseTracker(props.onCreate);

    function handleCreate() {
        if (form.validate().hasErrors) return;
        void create(form.getValues()).then(() => modals.closeAll());
    }

    return (
        <Stack>
            <TextInput label="Classroom" withAsterisk {...form.getInputProps("title")} />
            <Group justify="flex-end">
                <Button loading={isLoading} onClick={handleCreate}>
                    Confirm
                </Button>
            </Group>
        </Stack>
    );
};

export const Route = createFileRoute("/_auth/classrooms/")({
    loader: ({ context: { trpcQC } }) => {
        trpcQC.classroom.list.ensureData().catch(logger.log);
    },
    component,
});
