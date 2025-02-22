import { createFormContext } from "@mantine/form";
import { z } from "zod";

const podSchema = z.object({
    id: z.string(),
    title: z.string(),
    hex: z.string(),
});

type PodState = z.infer<typeof podSchema>;
export const [PodFormProvider, usePodFormContext, usePodForm] = createFormContext<PodState>();

export const classroomLayoutSchema = z.object({
    title: z.string(),
    height: z.number().int(),
    width: z.number().int(),
    pods: podSchema.array().default([]),
    nodes: z
        .object({
            id: z.string(),
            row: z.number().int(),
            col: z.number().int(),

            nodeType: z.union([z.literal("SEAT"), z.literal("ENTITY")]),
            entityType: z.union([z.literal("DOOR"), z.literal("WHITEBOARD"), z.literal("TEACHER")]).optional(),
            podId: z.string().cuid().optional(),
        })
        .array(),
});

export type ClassroomLayoutState = z.infer<typeof classroomLayoutSchema>;
export const [ClassroomLayoutFormProvider, useClassroomLayoutFormContext, useClassroomLayoutForm] =
    createFormContext<ClassroomLayoutState>();
