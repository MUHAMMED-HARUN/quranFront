import { z } from 'zod';
import { EvaluationLevel } from './completionRecord.types';

export const CreateCompletionRecordSchema = z.object({
  StudentEnrollmentID: z.string().uuid().min(1, 'حقل الطالب مطلوب'),
  ScopeExecutionID: z.string().uuid().min(1, 'حقل مستوى التنفيذ مطلوب'),
  ScopeExecutionDetailID: z.string().uuid().optional(),
  CompletionDate: z.string().min(10, 'التاريخ مطلوب'),
  EvaluationLevel: z.nativeEnum(EvaluationLevel),
  FinalScore: z.number().min(0, "الدرجة يجب أن تكون أكبر من أو تساوي 0").optional(),
  Notes: z.string().optional()
});

export const UpdateCompletionRecordSchema = CreateCompletionRecordSchema.and(
  z.object({
    Id: z.string().min(1, 'المعرف مطلوب')
  })
);
