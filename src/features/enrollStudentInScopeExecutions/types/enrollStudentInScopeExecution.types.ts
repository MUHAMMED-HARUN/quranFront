import { z } from "zod";

export enum EnrollmentStatus {
    Pending = 1,
    InProgress = 2,
    Completed = 3,
    Failed = 4
}

export interface EnrollStudentInScopeExecution {
    Id: string;
    ScopeExecutionID: string;
    StudentID: string;
    StudentName?: string;
    NationalNumber?: string;
    EnrollmentDate: string;
    Status: EnrollmentStatus;
    StartDate?: string | null;
    CompletionDate?: string | null;
    Notes?: string | null;
}

export interface CreateEnrollStudentInScopeExecutionCommand {
    ScopeExecutionID: string;
    StudentID: string;
    EnrollmentDate: string;
    Status: EnrollmentStatus;
    StartDate?: string | null;
    CompletionDate?: string | null;
    Notes?: string | null;
}

export interface UpdateEnrollStudentInScopeExecutionCommand {
    Id: string;
    ScopeExecutionID: string;
    StudentID: string;
    EnrollmentDate: string;
    Status: EnrollmentStatus;
    StartDate?: string | null;
    CompletionDate?: string | null;
    Notes?: string | null;
}

export const EnrollStudentInScopeExecutionSchema = z.object({
    id: z.string().optional(),
    scopeExecutionID: z.string().min(1, "الرجاء تحديد التنفيذ"),
    studentID: z.string().min(1, "الرجاء اختيار الطالب"),
    enrollmentDate: z.string().min(1, "تاريخ التسجيل مطلوب"),
    status: z.nativeEnum(EnrollmentStatus),
    startDate: z.string().nullable().optional(),
    completionDate: z.string().nullable().optional(),
    notes: z.string().nullable().optional(),
}).refine(data => {
    if (data.status === EnrollmentStatus.Completed && !data.completionDate) {
        return false;
    }
    return true;
}, {
    message: "تاريخ الانتهاء مطلوب عند اختيار الحالة مكتمل",
    path: ["completionDate"]
});
