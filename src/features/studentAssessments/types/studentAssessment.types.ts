import { z } from "zod";

export enum StudentAssessmentStatus {
    Attended = 1,
    Absent = 2,
    Excused = 3
}

export interface StudentAssessment {
    Id: string;
    AssessmentScopeID: string;
    StudentID: string;
    ScopeUnitTypeID: string;
    From?: string | null;
    To?: string | null;
    SubjectID: string;
    Score: number;
    Status: StudentAssessmentStatus;
    Notes?: string | null;
}

export interface CreateStudentAssessmentCommand {
    AssessmentScopeID: string;
    StudentID: string;
    ScopeUnitTypeID: string;
    From?: string | null;
    To?: string | null;
    SubjectID: string;
    Score: number;
    Status: StudentAssessmentStatus;
    Notes?: string | null;
}

export interface UpdateStudentAssessmentCommand extends CreateStudentAssessmentCommand {
    Id: string;
}

export const StudentAssessmentSchema = z.object({
    AssessmentScopeID: z.string().min(1, "نطاق التقييم مطلوب"),
    StudentID: z.string().min(1, "الطالب مطلوب"),
    ScopeUnitTypeID: z.string().min(1, "وحدة النطاق مطلوبة"),
    From: z.string().optional().nullable(),
    To: z.string().optional().nullable(),
    SubjectID: z.string().min(1, "المقرر مطلوب"),
    Score: z.coerce.number().min(0, "يجب أن تكون الدرجة قيمة موجبة"),
    Status: z.nativeEnum(StudentAssessmentStatus, { error: "حالة التقييم مطلوبة" }),
    Notes: z.string().optional().nullable()
});
