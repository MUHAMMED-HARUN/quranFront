import { z } from "zod";

export const AddStudentEnrollmentSchema = z.object({
    StudentID: z.string().min(1, "الطالب مطلوب"),
    GroupID: z.string().min(1, "المجموعة مطلوبة"),
    Date: z.string().min(1, "التاريخ مطلوب"),
});

export const UpdateStudentEnrollmentSchema = z.object({
    StudentEnrollmentID: z.string().uuid("رقم السجل غير صالح"),
    StudentID: z.string().min(1, "الطالب مطلوب"),
    GroupID: z.string().min(1, "المجموعة مطلوبة"),
    Date: z.string().min(1, "التاريخ مطلوب"),
});
