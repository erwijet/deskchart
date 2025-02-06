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
    nodes: z
        .object({
            id: z.string(),
            row: z.number().int(),
            col: z.number().int(),

            entityType: z.union([z.literal("SEAT"), z.literal("WHITEBOARD"), z.literal("TEACHER")]).optional(),
            podId: z.string().cuid().optional(),
        })
        .array(),
});

export type ClassroomState = z.infer<typeof classroomSchema>;
export const [ClassroomFormProvider, useClassroomFormContext, useClassroomForm] = createFormContext<ClassroomState>();
