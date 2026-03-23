import { z } from "zod";

export const CreateInstituteClassSchema = z.object({
    InstituteID: z.string().min(1, "الجهة/المعهد مطلوب"),
    ClassID: z.string().min(1, "الحلقة مطلوبة"),
});

export const UpdateInstituteClassSchema = z.object({
    InstituteClassID: z.string().min(1, "معرف العلاقة مطلوب"),
    InstituteID: z.string().min(1, "الجهة/المعهد مطلوب"),
    ClassID: z.string().min(1, "الحلقة مطلوبة"),
});
