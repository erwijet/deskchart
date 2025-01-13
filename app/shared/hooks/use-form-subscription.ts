import { UseFormReturnType } from "@mantine/form";
import { LooseKeys, PathValue } from "@mantine/form/lib/types";
import { useState } from "react";

export function useFormSubscription<V, K extends LooseKeys<V>>(form: UseFormReturnType<V>, k: K) {
    const [v, setV] = useState(form.getInputProps(k).value);
    form.watch(k, ({ value }) => setV(value));

    return v as PathValue<V, K>;
}
