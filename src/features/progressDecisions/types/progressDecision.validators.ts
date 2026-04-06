import { z } from 'zod';
import { DecisionType, DecisionAuthority } from './progressDecision.types';

export const CreateProgressDecisionSchema = z.object({
  StudentEnrollmentID: z.string().uuid().min(1, 'حقل الطالب مطلوب'),
  ScopeExecutionID: z.string().uuid().min(1, 'حقل مستوى التنفيذ مطلوب'),
  ScopeExecutionDetailID: z.string().uuid().optional(),
  DecisionType: z.nativeEnum(DecisionType),
  DecisionAuthority: z.nativeEnum(DecisionAuthority),
  DecisionAuthorityId: z.string().uuid().optional(),
  DecisionDate: z.string().min(10, 'التاريخ مطلوب'),
  Notes: z.string().optional()
});

export const UpdateProgressDecisionSchema = CreateProgressDecisionSchema.and(
  z.object({
    Id: z.string().min(1, 'المعرف مطلوب')
  })
);
