import { Button, ColorInput, Divider, Group, Menu, Stack, TextInput, Title } from "@mantine/core";
import { zodResolver } from "@mantine/form";
import { modals } from "@mantine/modals";
import { ChevronDown, Group as GroupIcon } from "lucide-react";
import { z } from "zod";
import { randomId } from "@mantine/hooks";
import { SeatsEditor } from "shared/components/layout/seats-editor";
import { useClassroomFormContext, usePodForm } from "../classroom/context";

export const LayoutEditor = () => {
    const form = useClassroomFormContext();

    return (
        <Stack>
            <Group justify="flex-end">
                {/* <Menu>
                    <Menu.Target>
                        <Button variant="default" rightSection={<ChevronDown size={16} />}>
                            Nodes
                        </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Item
                            leftSection={<GroupIcon size={16} />}
                            onClick={() =>
                                modals.open({
                                    title: <Title order={5}>Create Pod</Title>,
                                    children: <PodEditor onConfirm={(data) => form.insertListItem("pods", data)} />,
                                })
                            }
                        >
                            Edit Pods
                        </Menu.Item>
                        {form.values.pods.length > 0 && (
                            <>
                                <Menu.Divider />
                                <Menu.Label>Insert Desk</Menu.Label>
                            </>
                        )}
                        {form.values.pods.map((pod) => (
                            <Menu.Item
                                key={pod.title}
                                onClick={() => {
                                    const o = {
                                        id: randomId("seat-"),
                                        row: 5,
                                        col: 5,
                                        podId: pod.id,
                                    };
                                    form.setFieldValue("seats", (p) => p.concat([o]));
                                }}
                            >
                                {pod.title}
                            </Menu.Item>
                        ))}
                    </Menu.Dropdown>
                </Menu> */}
            </Group>
            <SeatsEditor />
        </Stack>
    );
};

const PodEditor = (props: { onConfirm: (data: { id: string; title: string; hex: string }) => unknown }) => {
    const form = usePodForm({ validate: zodResolver(z.object({ title: z.string().nonempty(), hex: z.string().nonempty() })) });

    function handleConfirm() {
        if (form.validate().hasErrors) return;
        modals.closeAll();
        props.onConfirm({ ...form.getValues(), id: randomId("pod-") });
    }

    return (
        <Stack>
            <TextInput label="Pod Name" {...form.getInputProps("title")} />
            <ColorInput label="Color" {...form.getInputProps("hex")} />
            <Divider />
            <Group justify="flex-end">
                <Button onClick={handleConfirm}>Confirm</Button>
            </Group>
        </Stack>
    );
};
