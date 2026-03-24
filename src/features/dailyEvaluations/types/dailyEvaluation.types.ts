import { z } from "zod";

export interface DailyEvaluation {
    Id: string;
    StudentEnrollmentID: string;
    Date: string;
    From: number;
    To: number;
    UnitTypeID: string;
    MatterID: string;
    LevelID: number;
    MatterName?: string;
    StudentFullName?: string;
}

export interface CreateDailyEvaluationCommand {
    StudentEnrollmentID: string;
    Date: string;
    From: number;
    To: number;
    UnitTypeID: string;
    MatterID: string;
    LevelID: number;
}

export interface UpdateDailyEvaluationCommand extends CreateDailyEvaluationCommand {
    Id: string;
}

export const DailyEvaluationSchema = z.object({
    GroupID: z.string().optional(),
    StudentID: z.string().optional(),

    StudentEnrollmentID: z.string().min(1, "التسجيل مطلوب (يجب اختيار المجموعة والطالب)"),
    Date: z.string().min(1, "التاريخ مطلوب"),
    From: z.coerce.number().min(0, "من يجب أن يكون رقم صحيح الموجب"),
    To: z.coerce.number().min(0, "إلى يجب أن يكون رقم صحيح الموجب"),
    UnitTypeID: z.string().min(1, "نوع الوحدة مطلوب"),
    MatterID: z.string().min(1, "المادة مطلوبة"),
    LevelID: z.coerce.number().min(0, "مستوى التقييم مطلوب")
});
