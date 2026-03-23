import { z } from "zod";

export const AddGroupSchema = z.object({
    InstituteClassID: z.string().min(1, "الحلقة مطلوبة"),
    GroupName: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
    Code: z.string().min(1, "الرمز مطلوب"),
});

export const UpdateGroupSchema = z.object({
    GroupID: z.string().uuid("معرف المجموعة غير صالح"),
    InstituteClassID: z.string().min(1, "الحلقة مطلوبة"),
    GroupName: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
    Code: z.string().min(1, "الرمز مطلوب"),
});
