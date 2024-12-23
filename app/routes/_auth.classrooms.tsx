import { Button, Paper, Stack, TextInput } from "@mantine/core";
import { useField } from "@mantine/form";
import { createFileRoute } from "@tanstack/react-router";

import { trpc } from "~router";

export const Route = createFileRoute("/_auth/classrooms")({
    loader: ({ context: { trpcQueryUtils } }) => {
        trpcQueryUtils.classroom.list.ensureData();
    },
    component: RouteComponent,
});

function RouteComponent() {
    const [classrooms, { refetch }] = trpc.classroom.list.useSuspenseQuery();
    const { mutateAsync: createClassroom, isPending } = trpc.classroom.create.useMutation({ onSuccess: () => refetch() });

    const title = useField({ initialValue: "" });
    const desc = useField({ initialValue: "" });

    return (
        <Stack>
            <TextInput label="Title" {...title.getInputProps()} />
            <TextInput label="Description" {...desc.getInputProps()} />
            <Button
                loading={isPending}
                onClick={() => {
                    createClassroom({ title: title.getValue(), description: desc.getValue() });
                }}
            >
                Create
            </Button>

            {classrooms.map((classroom) => (
                <Paper key={classroom.id}>
                    <pre>{JSON.stringify(classroom, null, 2)}</pre>
                </Paper>
            ))}
        </Stack>
    );
}
