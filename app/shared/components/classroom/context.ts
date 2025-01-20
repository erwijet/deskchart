import { createFormContext } from "@mantine/form";
import { z } from "zod";

const podSchema = z.object({
    id: z.string(),
    title: z.string(),
    hex: z.string(),
});

type PodState = z.infer<typeof podSchema>;
export const [PodFormProvider, usePodFormContext, usePodForm] = createFormContext<PodState>();

export const classroomSchema = z.object({
    title: z.string(),
    height: z.number().int(),
    width: z.number().int(),
    pods: podSchema.array().default([]),
    seats: z
        .object({
            id: z.string(),
            row: z.number().int(),
            col: z.number().int(),
            podId: z.string().cuid(),
        })
        .array(),
});

type ClassroomState = z.infer<typeof classroomSchema>;
export const [ClassroomFormProvider, useClassroomFormContext, useClassroomForm] = createFormContext<ClassroomState>();
