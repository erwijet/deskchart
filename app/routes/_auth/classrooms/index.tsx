import { ActionIcon, Badge, Button, Group, Menu, Paper, Stack, Text } from "@mantine/core";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Edit, LayoutDashboard, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { Content } from "shared/components/content";
import { logger } from "shared/logger";
import { pluralize } from "shared/str";
import { trpc } from "shared/trpc";

export const Route = createFileRoute("/_auth/classrooms/")({
    loader: ({ context: { trpcQC } }) => {
        trpcQC.classroom.list.ensureData().catch(logger.log);
    },
    component: RouteComponent,
});

function RouteComponent() {
    const [classrooms] = trpc.classroom.list.useSuspenseQuery();
    const nav = useNavigate();

    return (
        <Content title="My Classrooms">
            <Content.Action>
                <Link to="/classrooms/create">
                    <Button component="div" variant="default" leftSection={<Plus size={16} />}>
                        Create
                    </Button>
                </Link>
            </Content.Action>

            <Stack>
                {classrooms.map(({ id, ...classroom }) => (
                    <Paper withBorder shadow="lg" p="md" key={id}>
                        <Group justify="space-between">
                            <div>
                                <Group>
                                    <Text size="xl" fw="light">
                                        {classroom.title}
                                    </Text>
                                    <Badge variant="light">{pluralize(classroom.students.length, "student")}</Badge>
                                </Group>
                                <Text size="sm" c="dimmed">
                                    {classroom.description}
                                </Text>
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
                                        Edit Classroom
                                    </Menu.Item>
                                    <Menu.Item leftSection={<LayoutDashboard size={16} />}>Create Layout</Menu.Item>
                                    <Menu.Item color="red" leftSection={<Trash2 size={16} />}>
                                        Delete
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        </Group>
                    </Paper>
                ))}
            </Stack>
        </Content>
    );
}
