import { ActionIcon, Button, Group, Loader, Stack, Tabs, Text, TextInput, Title } from "@mantine/core";
import { useField } from "@mantine/form";
import { modals } from "@mantine/modals";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { PlusCircle, X } from "lucide-react";
import { Suspense, useState } from "react";
import { Content } from "shared/components/content";
import { LayoutEditor } from "shared/components/layout/layout-editor";
import { logger } from "shared/logger";
import { trpc } from "shared/trpc";

export const Route = createFileRoute("/_auth/classrooms/$id/deskplans")({
    component: RouteComponent,
    loader: ({ context: { trpcQC }, params: { id } }) => {
        trpcQC.classroom.byId.ensureData(id).catch(logger.error);
        trpcQC.layout.byClassroom.ensureData(id).catch(logger.error);
    },
});

const LayoutBuilder = (props: { onCreate?: (fields: { title: string }) => Promise<unknown> }) => {
    const field = useField({ initialValue: "" });
    const [isLoading, setIsLoading] = useState(false);

    return (
        <Stack>
            <TextInput withAsterisk label="Title" {...field.getInputProps()} />
            <Group justify="flex-end">
                <Button
                    loading={isLoading}
                    onClick={() => {
                        setIsLoading(true);
                        props
                            .onCreate?.({ title: field.getValue() })
                            .catch(logger.error)
                            .finally(() => setIsLoading(false));
                    }}
                >
                    Create
                </Button>
            </Group>
        </Stack>
    );
};

function RouteComponent() {
    const { id } = useParams({ from: "/_auth/classrooms/$id/deskplans" });
    const [layouts, { refetch }] = trpc.layout.byClassroom.useSuspenseQuery(id);
    const [classroom] = trpc.classroom.byId.useSuspenseQuery(id);

    const [tab, setTab] = useState(layouts.at(0)?.id ?? null);
    function handleOnTabChange(tab: string | null) {
        if (tab == "$$new") {
            modals.open({
                title: <Title order={5}>New Layout</Title>,
                children: (
                    <LayoutBuilder
                        onCreate={({ title }) =>
                            createLayout({ title, classId: id })
                                .then(() => refetch())
                                .then(() => modals.closeAll())
                        }
                    />
                ),
            });
            return;
        }

        if (tab == null || tab.startsWith("$$")) return;
        setTab(tab);
    }

    return (
        <Content withBack title={classroom.title}>
            <Tabs value={tab} onChange={handleOnTabChange}>
                <Stack gap={"sm"}>
                    <Tabs.List>
                        {layouts.map((layout) => (
                            <Tabs.Tab value={layout.id} key={layout.id}>
                                <Group>
                                    {layout.title}
                                    <ActionIcon
                                        size="xs"
                                        variant="transparent"
                                        c="var(--mantine-color-text)"
                                        onClick={() =>
                                            modals.openConfirmModal({
                                                title: <Title order={5}>Delete Layout</Title>,
                                                children: <Text>Are you sure you want to delete this layout?</Text>,
                                                labels: {
                                                    confirm: "Delete",
                                                    cancel: "Cancel",
                                                },
                                                confirmProps: {
                                                    color: "red",
                                                },
                                                closeOnConfirm: false,
                                                onConfirm() {
                                                    deleteLayout(layout.id)
                                                        .then(() => refetch())
                                                        .then(() => modals.closeAll())
                                                        .then(() => {
                                                            const nextTab = layouts.at(0)?.id;
                                                            if (!!nextTab) setTab(nextTab);
                                                        })
                                                        .catch(logger.error);
                                                },
                                            })
                                        }
                                    >
                                        <X />
                                    </ActionIcon>
                                </Group>
                            </Tabs.Tab>
                        ))}
                        <Tabs.Tab value={"$$new"}>
                            {isCreatePending ? <Loader type="oval" size={16} style={{ transform: "unset" }} /> : <PlusCircle size={16} />}
                        </Tabs.Tab>
                    </Tabs.List>

                    <Suspense fallback={<Loader my="xl" />}>
                        <LayoutEditor layoutId={layouts.find(({ id }) => id == tab)!.id} />
                    </Suspense>
                </Stack>
            </Tabs>
        </Content>
    );
}
