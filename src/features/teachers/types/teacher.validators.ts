import { z } from "zod";

export const SetPersonAsTeacherSchema = z.object({
    PersonID: z.string().min(1, "يجب تحديد الشخص الذي سيتم تعيينه كمعلم"),
});

export const UpdateTeacherSchema = z.object({
    TeacherID: z.string().min(1, "معرف المعلم مطلوب"),
    NewPersonID: z.string().min(1, "يجب تحديد الشخص الجديد الذي سيرتبط بهذا المعلم"),
});
