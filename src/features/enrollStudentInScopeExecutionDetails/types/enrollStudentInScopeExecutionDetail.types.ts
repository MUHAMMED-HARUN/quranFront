import { z } from "zod";

export enum EnrollmentStatus {
    Enrolled = 1,
    Completed = 2,
    Withdrawn = 3,
    Transferred = 4
}

export interface EnrollStudentInScopeExecutionDetail {
    Id: string;
    ScopeExecutionDetailID: string;
    StudentID: string;
    EnrollmentDate: string;
    Status: EnrollmentStatus;
    StartDate: string | null;
    CompletionDate: string | null;
    Notes: string | null;
    ScopeExecutionDetailName?: string;
    StudentName?: string;
}

export interface CreateEnrollStudentInScopeExecutionDetailCommand {
    ScopeExecutionDetailID: string;
    StudentID: string;
    EnrollmentDate: string;
    Status: EnrollmentStatus;
    StartDate: string | null;
    CompletionDate: string | null;
    Notes: string | null;
}

export interface UpdateEnrollStudentInScopeExecutionDetailCommand extends CreateEnrollStudentInScopeExecutionDetailCommand {
    Id: string;
}

export const EnrollStudentInScopeExecutionDetailSchema = z.object({
    Id: z.string().optional(),
    ScopeExecutionDetailID: z.string().min(1, "صيغة العملية مطلوبة"),
    StudentID: z.string().min(1, "الطالب مطلوب"),
    EnrollmentDate: z.string().min(1, "تاريخ التسجيل مطلوب"),
    Status: z.nativeEnum(EnrollmentStatus),
    StartDate: z.string().nullable().optional(),
    CompletionDate: z.string().nullable().optional(),
    Notes: z.string().nullable().optional(),
}).refine(data => {
    if (data.Status === EnrollmentStatus.Completed && !data.CompletionDate) {
        return false;
    }
    return true;
}, {
    message: "تاريخ الانتهاء مطلوب عند اختيار حالة المنجز",
    path: ["CompletionDate"]
}).refine(data => {
    if (data.StartDate && data.CompletionDate) {
        return new Date(data.StartDate) <= new Date(data.CompletionDate);
    }
    return true;
}, {
    message: "تاريخ البدء يجب أن يكون قبل أو يساوي تاريخ الانتهاء",
    path: ["StartDate"]
});
