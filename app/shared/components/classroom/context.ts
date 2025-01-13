import { createFormContext } from "@mantine/form";
import { z } from "zod";

export const classroomSchema = z.object({
    title: z.string().nonempty(),
    description: z.string(),
    students: z
        .object({
            gn: z.string(),
            sn: z.string(),
        })
        .array(),
});

type ClassroomState = z.infer<typeof classroomSchema>;
export const [ClassroomFormProvider, useClassroomFormContext, useClassroomForm] = createFormContext<ClassroomState>();
