import { ActionIcon, Group, Box, Button, Drawer, rem, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { Cog, Trash2 } from "lucide-react";
import { ClassroomEditor } from "shared/components/classroom/classroom-editor";
import { ClassroomFormProvider, ClassroomState, useClassroomForm } from "shared/components/classroom/context";
import { Content } from "shared/components/content";
import { LayoutEditor } from "shared/components/layout/layout-editor";
import { SplitButton } from "shared/components/split-button";
import { runVoiding } from "shared/fns";
import { logger } from "shared/logger";
import { createCuid } from "shared/str";
import { trpc } from "shared/trpc";

function RouteComponent() {
    const { id } = useParams({ from: "/_auth/classrooms/$id/edit" });
    const [classroom, { refetch }] = trpc.classroom.details.useSuspenseQuery(id);
    const { mutateAsync: deleteAsync } = trpc.classroom.delete.useMutation();
    const { mutateAsync: saveSettings } = trpc.classroom.settings.save.useMutation();

    const nav = useNavigate();

    const form = useClassroomForm({
        initialValues: {
            height: 0,
            width: 0,
            title: classroom.title,
            pods: classroom.pods,
            seats: classroom.pods.flatMap((p) => p.seats),
        },
    });

    function handleSaveSettings(data: ClassroomState) {
        saveSettings({ id, ...data })
            .then(runVoiding(refetch))
            .then(close)
            .catch(logger.error);
    }

    function handleDelete() {
        modals.openConfirmModal({
            title: "Delete Classroom",
            children: <Text size="sm">Are you sure you want to delete this classroom? This action cannot be undone.</Text>,
            confirmProps: {
                color: "red",
                leftSection: <Trash2 size={16} />,
            },
            labels: {
                confirm: "Delete",
                cancel: "Cancel",
            },
            onConfirm() {
                deleteAsync(id).then(() => nav({ to: "/classrooms" }));
            },
        });
    }

    function handleAddSeat() {
        form.setFieldValue("seats", (prev) =>
            prev.concat([{ id: createCuid(), col: 10, row: 10, podId: form.getValues().pods.at(0)!.id }]),
        );
    }

    const [opened, { open, close }] = useDisclosure(false);

    return (
        <ClassroomFormProvider form={form}>
            <Content withBack title={classroom.title}>
                <Content.Action>
                    <Button variant="default" onClick={handleAddSeat}>
                        Add Seat
                    </Button>
                </Content.Action>
                <Content.Action>
                    <SplitButton
                        menu={{
                            Settings: { fn: open, icon: <Cog size={16} /> },
                        }}
                    >
                        Save Layout
                    </SplitButton>
                </Content.Action>

                <Drawer opened={opened} onClose={close} position="right" title={<Title order={3}>Settings</Title>} closeOnEscape={false}>
                    <ClassroomEditor onDelete={handleDelete} onSave={handleSaveSettings} />
                </Drawer>

                <LayoutEditor />

                {/* <Button onClick={open}>Edit Details</Button> */}

                {/* <LayoutFormProvider form={layoutForm}>
                <LayoutEditor layoutId={classroom.layouts.at(0)!.id} />
            </LayoutFormProvider> */}

                {/* <Table>
                <Table.Tbody>
                    {classroom.layouts.map((layout) => (
                        <Table.Tr key={layout.id}>
                            <Table.Td>
                                <Text>{`${layout.title}`}</Text>
                                <Text size="xs" c="dimmed">
                                    <em>{getRelativeTimeString(new Date(layout.updatedAt))}</em>
                                </Text>
                            </Table.Td>
                            <Table.Td>
                                <Group justify="flex-end">
                                    <Menu position="bottom-start">
                                        <Menu.Target>
                                            <ActionIcon variant="transparent">
                                                <MoreHorizontal />
                                            </ActionIcon>
                                        </Menu.Target>
                                        <Menu.Dropdown>
                                            <Menu.Item leftSection={<LayoutDashboard size={16} />}>Edit</Menu.Item>
                                            <Menu.Item leftSection={<Trash2 size={16} />} color="red">
                                                Delete
                                            </Menu.Item>
                                        </Menu.Dropdown>
                                    </Menu>
                                </Group>
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table> */}
            </Content>
        </ClassroomFormProvider>
    );
}

export const Route = createFileRoute("/_auth/classrooms/$id/edit")({
    loader: ({ context: { trpcQC: trpcQueryUtils }, params: { id } }) => {
        trpcQueryUtils.classroom.details.ensureData(id).catch(logger.log);
    },
    component: RouteComponent,
});
