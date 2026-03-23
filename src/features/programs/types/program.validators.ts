import { z } from "zod";

export const CreateProgramSchema = z.object({
    Name: z.string().min(2, "اسم البرنامج مطلوب"),
    Notes: z.string().optional(),
});

export const UpdateProgramSchema = z.object({
    ProgramID: z.string().min(1, "معرف البرنامج مطلوب"),
    Name: z.string().min(2, "اسم البرنامج مطلوب"),
    Notes: z.string().optional(),
});
