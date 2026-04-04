import { z } from "zod";

export interface StudentScopeExecutionsDetailsRegister {
    Id: string;
    ScopeExecutionDetailID: string;
    StudentEnrollmentID: string;
    ScopeExecutionDetailName?: string | null;
    StudentName?: string | null;
    NationalNumber?: string | null;
    Status: number;
    StartDate?: string | null;
    Notes?: string | null;
}

export interface StudentScopeExecutionsDetailsRegisterDetailedDto {
    Id: string;
    ScopeExecutionDetailID: string;
    StudentEnrollmentID: string;
    StudentName?: string | null;
    GroupName?: string | null;
    ScopeExecutionName?: string | null;
    ScopeUnitTypeName?: string | null;
    ScopeFrom?: number | null;
    ScopeTo?: number | null;
    Status: number;
    StartDate?: string | null;
    CompletionDate?: string | null;
    Notes?: string | null;
}

export interface CreateStudentScopeExecutionsDetailsRegisterCommand {
    ScopeExecutionDetailID: string;
    StudentEnrollmentID: string;
    Status: number;
    StartDate?: string | null;
    CompletionDate?: string | null;
    Notes?: string | null;
}

export interface UpdateStudentScopeExecutionsDetailsRegisterCommand extends CreateStudentScopeExecutionsDetailsRegisterCommand {
    Id: string;
}

export const StudentScopeExecutionsDetailsRegisterSchema = z.object({
    ScopeExecutionDetailID: z.string().min(1, "النطاق التفصيلي مطلوب"),
    StudentEnrollmentID: z.string().min(1, "الطالب مطلوب"),
    Status: z.number().int(),
    StartDate: z.string().optional().nullable(),
    CompletionDate: z.string().optional().nullable(),
    Notes: z.string().optional().nullable(),
});
