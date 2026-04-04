import { z } from 'zod';

export enum EvaluationLevel {
    Excellent = 1,
    VeryGood = 2,
    Good = 3,
    Weak = 4,
    VeryWeak = 5
}

export interface TestResultDetailDto {
    Id: string;
    TestSessionID: string;
    ScopeExecutionDetailID: string;
    Score?: number;
    EvaluationLevel?: EvaluationLevel;
    Notes?: string;
    
    // Presentation Formats
    ScopeExecutionDetailName?: string;
    StudentName?: string;
}

export interface CreateTestResultDetailCommand {
    TestSessionID: string;
    ScopeExecutionDetailID: string;
    Score?: number;
    EvaluationLevel?: EvaluationLevel;
    Notes?: string;
}

export interface UpdateTestResultDetailCommand extends CreateTestResultDetailCommand {
    Id: string;
}

export const CreateTestResultDetailSchema = z.object({
    TestSessionID: z.string().min(1, 'جلسة الاختبار مطلوبة'),
    ScopeExecutionDetailID: z.string().min(1, 'التفصيل المُمتحن عليه مطلوب'),
    Score: z.number().optional(),
    EvaluationLevel: z.nativeEnum(EvaluationLevel).optional(),
    Notes: z.string().optional()
}).refine(data => data.Score !== undefined || data.EvaluationLevel !== undefined, {
    message: "يجب ادخال إما درجة رقمية أو مستوى تقييم وصفي",
    path: ["Score"]
});
