import { z } from "zod";

export interface ScopeExecution {
    Id: string;
    Name: string;
    AssessmentScopeID: string;
    Description?: string;
}

export interface CreateScopeExecutionCommand {
    Name: string;
    AssessmentScopeID: string;
    Description?: string;
}

export interface UpdateScopeExecutionCommand extends CreateScopeExecutionCommand {
    Id: string;
}

export const ScopeExecutionSchema = z.object({
    Name: z.string().min(1, "الاسم مطلوب"),
    AssessmentScopeID: z.string().min(1, "نطاق التقييم مطلوب"),
    Description: z.string().optional().nullable()
});
