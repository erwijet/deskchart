import { Button, Group, List, Stack, Text, TextInput, Title } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { modals } from "@mantine/modals";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Content } from "shared/components/content";
import { runVoiding } from "shared/fns";
import { usePromiseTracker } from "shared/hooks/use-promise-tracker";
import { logger } from "shared/logger";
import { trpc } from "shared/trpc";
import { z } from "zod";

export const Route = createFileRoute("/_auth/classrooms/")({
    loader: ({ context: { trpcQC } }) => {
        trpcQC.classroom.list.ensureData().catch(logger.log);
    },
    component: RouteComponent,
});

function RouteComponent() {
    const [classrooms, { refetch }] = trpc.classroom.list.useSuspenseQuery();
    const { mutateAsync: create } = trpc.classroom.create.useMutation();

    const nav = useNavigate();

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
                                <Link to="/classrooms/$id/details" params={{ id: classroom.id }}>
                                    <Button variant="transparent" size="compact-md">
                                        Details
                                    </Button>
                                </Link>
                                <Link to="/classrooms/$id/edit" params={{ id: classroom.id }}>
                                    <Button variant="transparent" size="compact-md">
                                        Edit
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

            {/* <Stack>
                {classrooms.map(({ id, ...classroom }) => (
                    <Paper withBorder shadow="lg" p="md" key={id}>
                        <Group justify="space-between">
                            <div>
                                <Group>
                                    <Text size="xl" fw="light">
                                        {classroom.title}
                                    </Text>
                                </Group>
                            </div>
                            <Menu>
                                <Menu.Target>
                                    <ActionIcon variant="transparent" onClick={(e) => e.preventDefault()}>
                                        <MoreHorizontal />
                                    </ActionIcon>
                                </Menu.Target>
                                <Menu.Dropdown>
                                    <Menu.Item
                                        leftSection={<Edit size={16} />}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            void nav({ to: "/classrooms/$id/edit", params: { id } });
                                        }}
                                    >
                                        Edit Layout
                                    </Menu.Item>
                                    <Menu.Item color="red" leftSection={<Trash2 size={16} />}>
                                        Delete
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        </Group>
                    </Paper>
                ))}
            </Stack> */}
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
