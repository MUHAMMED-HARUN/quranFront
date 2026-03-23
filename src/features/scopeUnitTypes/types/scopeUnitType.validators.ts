import { z } from "zod";

export const AddScopeUnitTypeSchema = z.object({
    Name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
    LevelNumber: z.coerce.number().min(0, "رقم المستوى يجب أن يكون صفراً أو أكبر"),
    Notes: z.string().optional(),
});

export const UpdateScopeUnitTypeSchema = z.object({
    ID: z.string().uuid("معرف غير صالح"),
    Name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
    LevelNumber: z.coerce.number().min(0, "رقم المستوى يجب أن يكون صفراً أو أكبر"),
    Notes: z.string().optional(),
});
