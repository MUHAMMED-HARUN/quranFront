import { z } from "zod";

export const SetPersonAsStudentSchema = z.object({
    PersonID: z.string().min(1, "يجب تحديد الشخص الذي سيتم تعيينه كطالب"),
});

export const UpdateStudentSchema = z.object({
    StudentID: z.string().min(1, "معرف الطالب مطلوب"),
    NewPersonID: z.string().min(1, "يجب تحديد الشخص الجديد الذي سيرتبط بهذا الطالب"),
});
