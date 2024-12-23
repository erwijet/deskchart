import { Button, Group, Paper, Stack, Title } from "@mantine/core";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { trpc } from "~router";

export const Route = createFileRoute("/_auth/classrooms/")({
    loader: ({ context: { trpcQueryUtils } }) => {
        trpcQueryUtils.classroom.list.ensureData();
    },
    component: RouteComponent,
});

function RouteComponent() {
    const [classrooms, { refetch }] = trpc.classroom.list.useSuspenseQuery();

    return (
        <Stack py="md">
            <Group justify="space-between" w="100%">
                <Title order={2}>My Classrooms</Title>
                <Link to="/classrooms/create">
                    <Button component="div" variant="default" leftSection={<Plus size={16} />}>
                        Create
                    </Button>
                </Link>
            </Group>

            {classrooms.map((classroom) => (
                <Paper withBorder shadow="lg" key={classroom.id} p="md">
                    <pre>{JSON.stringify(classroom, null, 2)}</pre>
                </Paper>
            ))}
        </Stack>
    );
}
