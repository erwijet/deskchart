import { ActionIcon, Button, Divider, Group, Paper, SimpleGrid, Stack, Text, TextInput, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { colord, extend } from "colord";
import names from "colord/plugins/names";
import {
    ClassroomLayoutState,
    PodFormProvider,
    useClassroomLayoutFormContext,
    usePodForm,
} from "shared/components/classroom/layout/context";
import { PodEditor } from "shared/components/classroom/layout/pod-editor";
import { Edit, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { createRandomColor } from "shared/color";
import { createCuid, titlecase } from "shared/str";

extend([names]);

export const SettingsEditor = (props: { onDelete?: () => unknown; onSave?: (data: ClassroomLayoutState) => unknown }) => {
    const form = useClassroomLayoutFormContext();
    const pod = usePodForm();

    function handleCreatePod() {
        const id = createCuid();
        const hex = createRandomColor().hex();
        const title = titlecase(colord(hex).toName({ closest: true })!) + " Pod";

        form.setFieldValue("pods", (prev) => prev.concat([{ id, title, hex }]));
    }

    function handleEditPod(id: string) {
        const { pods } = form.getValues();
        const idx = pods.findIndex((it) => it.id == id);

        function handleCancel() {
            modals.closeAll();
        }

        function handleDelete() {
            form.setFieldValue("pods", (prev) => prev.toSpliced(idx, 1));
            modals.closeAll();
        }

        function handleSave() {
            form.setFieldValue("pods", (prev) => prev.toSpliced(idx, 1, { ...pod.getValues() }));
            modals.closeAll();
        }

        pod.setValues(form.values.pods.find((it) => it.id == id)!);
        modals.open({
            title: "Edit Pod",
            children: (
                <PodFormProvider form={pod}>
                    <PodEditor />
                    <Divider mt="xl" mb="md" mx="-md" />
                    <Group justify="space-between">
                        <Button color="red" onClick={handleDelete}>
                            Delete
                        </Button>
                        <Group>
                            <Button variant="default" onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave}>Done</Button>
                        </Group>
                    </Group>
                </PodFormProvider>
            ),
        });
    }

    return (
        <Stack>
            <TextInput label="Title" {...form.getInputProps("title")} placeholder="Honors Precalculus" />
            <Divider />

            <Group justify="space-between">
                <Title order={4}>Pods</Title>
                <Button variant="default" onClick={handleCreatePod}>
                    New
                </Button>
            </Group>

            <SimpleGrid cols={2}>
                {form.values.pods.map((pod) => (
                    <motion.div layout key={pod.id}>
                        <Paper style={{ backgroundColor: pod.hex }} p="md">
                            <Group justify="space-between" wrap="nowrap">
                                <Text size="sm" c="black" truncate="end">
                                    {pod.title}
                                </Text>
                                <Group gap={0}>
                                    <ActionIcon variant="transparent" c={"black"} onClick={() => handleEditPod(pod.id)}>
                                        <Edit size={16} />
                                    </ActionIcon>
                                </Group>
                            </Group>
                        </Paper>
                    </motion.div>
                ))}
            </SimpleGrid>

            <Divider />

            <Group justify="space-between" gap="xs">
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
