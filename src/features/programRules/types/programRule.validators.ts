import { z } from 'zod';
import { ProgramRuleType, ComparisonType } from './programRule.types';

export const CreateProgramRuleSchema = z.object({
  ScopeExecutionID: z.union([z.string().uuid("يجب أن يكون معرّف صحيحاً"), z.literal(''), z.null()]).optional().transform(v => v === '' ? null : v),
  ScopeExecutionDetailID: z.union([z.string().uuid("يجب أن يكون معرّف صحيحاً"), z.literal(''), z.null()]).optional().transform(v => v === '' ? null : v),
  RuleType: z.nativeEnum(ProgramRuleType),
  ComparisonType: z.nativeEnum(ComparisonType),
  RequiredValue: z.number().min(0, "يجب أن تكون القيمة 0 أو أكبر"),
  IsMandatory: z.boolean(),
  Notes: z.union([z.string(), z.literal(''), z.null()]).optional().transform(v => v === '' ? null : v)
}).refine(data => {
  const hasA = Boolean(data.ScopeExecutionID && String(data.ScopeExecutionID).trim() !== '');
  const hasB = Boolean(data.ScopeExecutionDetailID && String(data.ScopeExecutionDetailID).trim() !== '');
  return (hasA || hasB) && !(hasA && hasB);
}, {
  message: "يجب اختيار إما معرّف التنفيذ الأساسي أو التفصيلي (وليس كلاهما)",
  path: ["ScopeExecutionID"]
});

export const UpdateProgramRuleSchema = CreateProgramRuleSchema.and(
  z.object({
    Id: z.string().min(1, 'المعرف مطلوب')
  })
);
