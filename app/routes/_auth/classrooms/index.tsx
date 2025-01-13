import { Badge, Button, Group, Paper, Stack, Text } from "@mantine/core";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
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
                    <Link to="/classrooms/$id/deskplans" params={{ id }} key={id}>
                        <Paper withBorder shadow="lg" p="md">
                            <Group justify="space-between">
                                <div>
                                    <Text size="xl" fw="light">
                                        {classroom.title}
                                    </Text>
                                    <Text size="sm" c="dimmed">
                                        {classroom.description}
                                    </Text>
                                </div>
                                <Group>
                                    <Badge>{pluralize(classroom.students.length, "student")}</Badge>
                                </Group>
                            </Group>
                        </Paper>
                    </Link>
                ))}
            </Stack>
        </Content>
    );
}
