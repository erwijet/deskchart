import { ActionIcon, Button, Divider, Group, Menu, Table, Text, Title } from "@mantine/core";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { LayoutDashboard, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { ClassroomEditor } from "shared/components/classroom/classroom-editor";
import { ClassroomFormProvider, useClassroomForm } from "shared/components/classroom/context";
import { Content } from "shared/components/content";
import { logger } from "shared/logger";
import { getRelativeTimeString } from "shared/temporal";

import { trpc } from "shared/trpc";

export const Route = createFileRoute("/_auth/classrooms/$id/edit")({
    loader: ({ context: { trpcQC: trpcQueryUtils }, params: { id } }) => {
        trpcQueryUtils.classroom.byId.ensureData(id).catch(logger.log);
    },
    component: RouteComponent,
});

function RouteComponent() {
    const { id } = useParams({ from: "/_auth/classrooms/$id/edit" });
    const [classroom] = trpc.classroom.byId.useSuspenseQuery(id);

    const form = useClassroomForm({ initialValues: classroom });

    return (
        <Content withBack title={classroom.title}>
            <Content.Action>
                <Button variant="subtle">Delete</Button>
            </Content.Action>

            <Content.Action>
                <Button>Save</Button>
            </Content.Action>

            <ClassroomFormProvider form={form}>
                <ClassroomEditor />
            </ClassroomFormProvider>

            <Divider label={<Title order={3}>Layouts</Title>} labelPosition="left" my="md" />

            <Table>
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
            </Table>
        </Content>
    );
}
