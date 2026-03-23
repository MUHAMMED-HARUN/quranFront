import { z } from "zod";

export const AddTeachingAssignmentSchema = z.object({
    TeacherID: z.string().min(1, "المعلم مطلوب"),
    GroupID: z.string().min(1, "المجموعة مطلوبة"),
    SubjectID: z.string().min(1, "المادة مطلوبة"),
});

export const UpdateTeachingAssignmentSchema = z.object({
    TeachingAssignmentID: z.string().uuid("رقم السجل غير صالح"),
    TeacherID: z.string().min(1, "المعلم مطلوب"),
    GroupID: z.string().min(1, "المجموعة مطلوبة"),
    SubjectID: z.string().min(1, "المادة مطلوبة"),
});
