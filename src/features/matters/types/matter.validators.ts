import { z } from "zod";

export const CreateMatterSchema = z.object({
    Name: z.string().min(2, "يجب أن يكون الاسم حرفين على الأقل"),
    ActorName: z.string().optional().nullable(),
    Description: z.string().optional().nullable(),
    Level: z.string().optional().nullable(),
    MatterType: z.number().int(),
    SubjectID: z.string().min(1, "الرجاء اختيار المقرر"),
});

export const UpdateMatterSchema = z.object({
    ID: z.string().min(1, "Invalid ID"),
    Name: z.string().min(2, "يجب أن يكون الاسم حرفين على الأقل"),
    ActorName: z.string().optional().nullable(),
    Description: z.string().optional().nullable(),
    Level: z.string().optional().nullable(),
    MatterType: z.number().int(),
    SubjectID: z.string().min(1, "الرجاء اختيار المقرر"),
});
