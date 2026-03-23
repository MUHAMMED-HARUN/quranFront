import { z } from "zod";

export const CreateSubjectSchema = z.object({
    SubjectName: z.string().min(2, "اسم المادة مطلوب"),
    Notes: z.string().optional(),
});

export const UpdateSubjectSchema = z.object({
    SubjectID: z.string().min(1, "معرف المادة مطلوب"),
    SubjectName: z.string().min(2, "اسم المادة مطلوب"),
    Notes: z.string().optional(),
});
