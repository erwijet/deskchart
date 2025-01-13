import { Button, ColorInput, Divider, Group, Menu, Stack, TextInput, Title } from "@mantine/core";
import { zodResolver } from "@mantine/form";
import { modals } from "@mantine/modals";
import { ChevronDown, Group as GroupIcon } from "lucide-react";
import { useEffect } from "react";
import { trpc } from "shared/trpc";
import { z } from "zod";

import { LayoutFormProvider, useLayoutForm, usePodForm } from "shared/components/layout/context";
import { SeatsEditor } from "shared/components/layout/seats-editor";

export const LayoutEditor = (props: { layoutId: string }) => {
    const [layout] = trpc.layout.byId.useSuspenseQuery(props.layoutId);
    const form = useLayoutForm({
        initialValues: { ...layout, seats: layout.pods.flatMap((pod) => pod.seats.flatMap((seat) => ({ ...seat, podId: pod.id }))) },
    });

    useEffect(() => {
        form.setValues({ ...layout, seats: layout.pods.flatMap((pod) => pod.seats.flatMap((seat) => ({ ...seat, podId: pod.id }))) });
    }, [layout.id]);

    return (
        <LayoutFormProvider form={form}>
            <Stack>
                <Group justify="flex-end">
                    <Menu>
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
                                <Menu.Item key={pod.title}>{pod.title}</Menu.Item>
                            ))}
                        </Menu.Dropdown>
                    </Menu>
                </Group>
                <SeatsEditor />
            </Stack>
        </LayoutFormProvider>
    );
};

const PodEditor = (props: { onConfirm: (data: { title: string; hex: string }) => unknown }) => {
    const form = usePodForm({ validate: zodResolver(z.object({ title: z.string().nonempty(), hex: z.string().nonempty() })) });

    function handleConfirm() {
        if (form.validate().hasErrors) return;
        props.onConfirm(form.getValues());
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
