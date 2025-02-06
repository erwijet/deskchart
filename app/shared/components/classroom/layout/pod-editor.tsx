import { ColorInput, Stack, TextInput } from "@mantine/core";
import { usePodFormContext } from "shared/components/classroom/layout/context";
import { useFormSubscription } from "shared/hooks/use-form-subscription";

export function PodEditor() {
    const form = usePodFormContext();

    useFormSubscription(form, "hex");
    useFormSubscription(form, "title");

    return (
        <Stack gap="xs">
            <TextInput label="Title" {...form.getInputProps("title")} />
            <ColorInput label="Color" {...form.getInputProps("hex")} />
        </Stack>
    );
}
