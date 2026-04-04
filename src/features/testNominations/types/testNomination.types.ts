import { z } from 'zod';

// Shared Enums (These usually sit in a global types file but defined here for feature scope)
export enum NominationStatus {
    Pending = 1,
    Approved = 2,
    Rejected = 3,
    Completed = 4
}

// ⚠️ PascalCase to match backend DTO exactly
export interface TestNominationDto {
    Id: string;
    StudentEnrollmentID: string;
    ScopeExecutionID?: string;
    ScopeExecutionDetailID?: string;
    NominationStatus: NominationStatus;
    NominatedByPersonID?: string;
    SuggestedDate?: string;
    
    // Read-only presentation properties from CQRS Details Query
    StudentName?: string;
    ScopeExecutionName?: string;
    ScopeExecutionDetailName?: string;
    NominatedByPersonName?: string;
}

export interface CreateTestNominationCommand {
    StudentEnrollmentID: string;
    ScopeExecutionID?: string;
    ScopeExecutionDetailID?: string;
    NominationStatus: NominationStatus;
    NominatedByPersonID?: string;
    SuggestedDate?: string;
}

export interface UpdateTestNominationCommand extends CreateTestNominationCommand {
    Id: string;
}

// Validation Schema
export const CreateTestNominationSchema = z.object({
    StudentEnrollmentID: z.string().min(1, 'الطالب مطلوب'),
    ScopeExecutionID: z.string().optional(),
    ScopeExecutionDetailID: z.string().optional(),
    NominationStatus: z.nativeEnum(NominationStatus),
    NominatedByPersonID: z.string().optional(),
    SuggestedDate: z.string().optional(),
}).refine(data => {
    return (data.ScopeExecutionID && data.ScopeExecutionID.length > 0) || 
           (data.ScopeExecutionDetailID && data.ScopeExecutionDetailID.length > 0);
}, {
    message: "يجب تحديد المنهج (Scope Execution) أو التفصيل (Scope Execution Detail) أو كلاهما",
    path: ["ScopeExecutionID"]
});
