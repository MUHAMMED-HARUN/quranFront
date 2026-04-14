import { z } from "zod";

export const CreateTestNominationSchema = z
  .object({
    StudentEnrollmentID: z.string().min(1, "رقم تسجيل الطالب مطلوب"),
    ScopeExecutionID: z.string().optional().nullable(),
    ScopeExecutionDetailID: z.string().optional().nullable(),
    NominationStatus: z.number(),
    NominatedByPersonID: z.string().optional().nullable(),
    SuggestedDate: z.string().optional().nullable(),
  })
  .refine(
    (data) => {
      // XOR logic: Exactly one of these should be present
      const hasExecution = !!data.ScopeExecutionID && data.ScopeExecutionID.length > 0;
      const hasDetail = !!data.ScopeExecutionDetailID && data.ScopeExecutionDetailID.length > 0;
      return (hasExecution && !hasDetail) || (!hasExecution && hasDetail);
    },
    {
      message: "يجب اختيار إما نطاق الاختبار أو تفصيل النطاق (وليس كلاهما أو ولا واحد)",
      path: ["ScopeExecutionID"], 
    }
  );

export type CreateTestNominationFormValues = z.infer<typeof CreateTestNominationSchema>;
