import { Button, Group, Stack, TextInput } from "@mantine/core";
import { Trash2 } from "lucide-react";
import { useClassroomFormContext } from "shared/components/classroom/context";

export const ClassroomEditor = (props: { onDelete?: () => unknown; onSave?: (data: { title: string }) => unknown }) => {
    const form = useClassroomFormContext();

    return (
        <Stack>
            <TextInput label="Title" {...form.getInputProps("title")} placeholder="Honors Precalculus" />
            <Group justify="flex-end" gap="xs">
                <Button variant="transparent" size="compact-md" leftSection={<Trash2 size={16} />} color="red" onClick={props.onDelete}>
                    Delete
                </Button>
                <Button size="compact-md" onClick={() => props.onSave?.({ ...form.getValues() })}>
                    Save
                </Button>
            </Group>
        </Stack>
    );
};
