import { z } from "zod";

export const CreateClassSchema = z.object({
    Name: z.string().min(2, "اسم الحلقة مطلوب"),
    Level: z.coerce.number().min(1, "المستوى مطلوب بحد أدنى 1"),
    ProgramID: z.string().min(1, "البرنامج الأكاديمي مطلوب"),
});

export const UpdateClassSchema = z.object({
    ClassID: z.string().min(1, "معرف الحلقة مطلوب"),
    Name: z.string().min(2, "اسم الحلقة مطلوب"),
    Level: z.coerce.number().min(1, "المستوى مطلوب بحد أدنى 1"),
    ProgramID: z.string().min(1, "البرنامج الأكاديمي مطلوب"),
});
