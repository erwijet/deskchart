import { ActionIcon, Button, Fieldset, Group, Input, Paper, SimpleGrid, Stack, Text, Textarea, TextInput, Title } from "@mantine/core";
import { createFormContext } from "@mantine/form";
import { useDebouncedValue } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { Pencil, Search, Trash, UserPlus2 } from "lucide-react";
import { useState } from "react";
import { useClassroomFormContext } from "shared/components/classroom/context";
import { useFormSubscription } from "shared/hooks/use-form-subscription";
import { useIsMobile } from "shared/hooks/use-is-mobile";

const [StudentFormProvider, useStudentFormContext, useStudentForm] = createFormContext<{ gn: string; sn: string }>();
const StudentEditor = () => {
    const form = useStudentFormContext();
    useFormSubscription(form, "gn");
    useFormSubscription(form, "sn");

    return (
        <Stack gap={"xs"}>
            <TextInput w="100%" label="Firstname" {...form.getInputProps("gn")} />
            <TextInput w="100%" label="Lastname" {...form.getInputProps("sn")} />
        </Stack>
    );
};

export const ClassroomEditor = () => {
    const { isMobile } = useIsMobile();
    const form = useClassroomFormContext();
    const students = useFormSubscription(form, "students");
    const studentForm = useStudentForm();

    const [search, setSearch] = useState("");
    const [debouncedSearch] = useDebouncedValue(search, 100);

    return (
        <Stack>
            <Fieldset legend="Classroom Details">
                <TextInput label="Title" {...form.getInputProps("title")} placeholder="Honors Precalculus" />
                <Textarea label="Description" {...form.getInputProps("description")} placeholder="Got some additional thoughts?" />
            </Fieldset>
            <Fieldset legend={`Students (${students.length})`}>
                <Stack>
                    <Group w="100%" justify="space-between">
                        <Input
                            leftSection={<Search size={16} />}
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button
                            variant="default"
                            leftSection={<UserPlus2 size={16} />}
                            onClick={() =>
                                modals.openConfirmModal({
                                    title: <Title order={5}>New Student</Title>,
                                    children: (
                                        <StudentFormProvider form={studentForm}>
                                            <StudentEditor />
                                        </StudentFormProvider>
                                    ),
                                    labels: {
                                        confirm: "Add",
                                        cancel: "Cancel",
                                    },
                                    onConfirm() {
                                        form.setFieldValue("students", (students) => students.concat([{ ...studentForm.getValues() }]));
                                    },
                                    onClose() {
                                        studentForm.reset();
                                    },
                                })
                            }
                        >
                            New Student
                        </Button>
                    </Group>
                    <SimpleGrid cols={isMobile ? 1 : 3}>
                        {students
                            .filter(({ gn, sn }) =>
                                debouncedSearch.trim() == ""
                                    ? true
                                    : [gn, sn].some((sample) => sample.toLowerCase().includes(debouncedSearch.toLowerCase())),
                            )
                            .map((student, i) => (
                                <Paper withBorder key={i} p="xs">
                                    <Group justify="space-between">
                                        <Group gap={3}>
                                            <Text>{student.gn}</Text>
                                            <Text fw="bold">{student.sn}</Text>
                                        </Group>
                                        <Group gap={"xs"}>
                                            <ActionIcon.Group>
                                                <ActionIcon
                                                    variant="default"
                                                    onClick={() => {
                                                        studentForm.setFieldValue("gn", student.gn);
                                                        studentForm.setFieldValue("sn", student.sn);

                                                        modals.openConfirmModal({
                                                            title: <Title order={5}>Edit Student</Title>,
                                                            children: (
                                                                <StudentFormProvider form={studentForm}>
                                                                    <StudentEditor />
                                                                </StudentFormProvider>
                                                            ),
                                                            onConfirm() {
                                                                form.setFieldValue("students", (students) =>
                                                                    students.map((each, curI) =>
                                                                        curI == i ? studentForm.getValues() : each,
                                                                    ),
                                                                );
                                                            },
                                                            onClose() {
                                                                studentForm.reset();
                                                            },
                                                            labels: {
                                                                confirm: "Save",
                                                                cancel: "Cancel",
                                                            },
                                                        });
                                                    }}
                                                >
                                                    <Pencil size={16} />
                                                </ActionIcon>
                                                <ActionIcon
                                                    variant="default"
                                                    onClick={() =>
                                                        modals.openConfirmModal({
                                                            title: <Title order={5}>Delete Student</Title>,
                                                            children: (
                                                                <Text>{`Are you sure you want to remove "${student.gn} ${student.sn}"?`}</Text>
                                                            ),
                                                            onConfirm() {
                                                                form.setFieldValue("students", (students) =>
                                                                    students.filter((_, curI) => curI != i),
                                                                );
                                                            },
                                                            labels: {
                                                                confirm: "Remove",
                                                                cancel: "Cancel",
                                                            },
                                                        })
                                                    }
                                                >
                                                    <Trash size={16} />
                                                </ActionIcon>
                                            </ActionIcon.Group>
                                        </Group>
                                    </Group>
                                </Paper>
                            ))}
                    </SimpleGrid>
                </Stack>
            </Fieldset>
        </Stack>
    );
};
