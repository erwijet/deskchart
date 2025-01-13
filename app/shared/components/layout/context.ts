import { createFormContext } from "@mantine/form";
import { z } from "zod";

const podSchema = z.object({
    title: z.string(),
    hex: z.string(),
});

type PodState = z.infer<typeof podSchema>;
export const [PodFormProvider, usePodFormContext, usePodForm] = createFormContext<PodState>();

export const layoutSchema = z.object({
    title: z.string(),
    classId: z.string().cuid(),
    height: z.number().int(),
    width: z.number().int(),
    pods: podSchema.array().default([]),
    seats: z
        .object({
            flag: z.enum(["draft", "deleted"]).optional(),
            row: z.number().int(),
            col: z.number().int(),
            podId: z.string().cuid(),
        })
        .array(),
});

type LayoutState = z.infer<typeof layoutSchema>;
export const [LayoutFormProvider, useLayoutFormContext, useLayoutForm] = createFormContext<LayoutState>();
